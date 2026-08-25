import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// --- 全局变量 ---
let scene, camera, renderer, composer;
let clock = new THREE.Clock();

const CONFIG = {
    text: "MERRY\nCHRISTMAS",
    textParticleRatio: 0.8 // 最多使用 80% 的树粒子来组成文字
};

// InstancedMesh 相关
let treeMesh, ribbonMesh, starMesh, snowMesh, topStarMesh;
let treeData = [], ribbonData = [], starData = [], snowData = [], topStarData = [];

// 辅助对象用于计算矩阵
const dummy = new THREE.Object3D();

// 交互相关
let handIndicator; // 手部位置指示器
let targetCameraPos = new THREE.Vector3(0, 0, 30);

// 状态枚举
const STATE = {
    TREE_COLLAPSED: 'collapsed', // 合拢
    TREE_SCATTERED: 'scattered', // 散开
};

// 交互相关变量
let isMobile = false;
let basePalmSize = 0.24;

// 当前状态
let currentTreeState = STATE.TREE_COLLAPSED;
let currentSnowState = STATE.TREE_COLLAPSED;

// --- 初始化函数 ---
async function init() {
    // 1. Three.js 基础设置
    const canvas = document.getElementById('output_canvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 适配手机竖屏：调整相机距离
    const aspect = window.innerWidth / window.innerHeight;
    const baseZ = aspect < 1 ? 30 / aspect * 0.8 : 30;
    targetCameraPos.set(0, 0, baseZ);
    camera.position.copy(targetCameraPos);

    camera.lookAt(0, 5, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制最大像素比为2，优化手机性能
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. 后处理（辉光效果）
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2; // 辉光强度
    bloomPass.radius = 0.5;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // 3. 创建场景物体 (使用 InstancedMesh)
    createTree();
    createRibbon();
    createOrnaments();
    createSnow();

    // 4. 事件监听
    window.addEventListener('resize', onWindowResize);

    // 初始化设备参数
    checkDevice();

    // 5. 启动 MediaPipe
    setupMediaPipe();

    // 6. 开始渲染循环
    animate();

    document.getElementById('loading').style.display = 'none';
}

// --- 粒子/物体创建逻辑 (InstancedMesh) ---

function createTree() {
    const geometry = new THREE.TetrahedronGeometry(0.15);
    // const material = new THREE.MeshBasicMaterial({ color: 0x22dd22 });
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const levels = 30;
    const particlesPerLevel = 30;
    // 预估最大数量
    const maxCount = levels * particlesPerLevel;

    // 临时存储计算出的数据
    const tempData = [];
    let actualCount = 0;

    for (let y = 0; y < levels; y++) {
        const radius = 8 * (1 - y / levels);
        const count = Math.max(5, Math.floor(particlesPerLevel * (1 - y / levels) * 3));

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5);
            const r = radius * (0.8 + Math.random() * 0.4);

            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const posY = y * 0.5 - 8;

            tempData.push({
                targetPos: new THREE.Vector3(x, posY, z),
                scatterPos: new THREE.Vector3((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60),
                currentPos: new THREE.Vector3((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50),
                id: actualCount
            });
            actualCount++;
        }
    }

    treeMesh = new THREE.InstancedMesh(geometry, material, actualCount);
    scene.add(treeMesh);
    treeData = tempData;

    // 初始化位置
    for (let i = 0; i < actualCount; i++) {
        dummy.position.copy(treeData[i].currentPos);
        dummy.updateMatrix();
        treeMesh.setMatrixAt(i, dummy.matrix);
    }

    // --- 生成文字粒子映射 ---
    const textPoints = generateTextPoints(CONFIG.text);
    // 打乱文字点，使分配更随机
    textPoints.sort(() => Math.random() - 0.5);

    // 计算可用粒子数
    const availableCount = Math.floor(treeData.length * CONFIG.textParticleRatio);
    const useCount = Math.min(availableCount, textPoints.length);

    // 创建索引数组并打乱，用于随机选取粒子去组成文字
    const indices = Array.from({length: treeData.length}, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);

    for (let i = 0; i < treeData.length; i++) {
        const particleIndex = indices[i];
        if (i < useCount) {
            treeData[particleIndex].isTextParticle = true;
            treeData[particleIndex].textPos = textPoints[i];
        } else {
            treeData[particleIndex].isTextParticle = false;
        }
    }
}

function generateTextPoints(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = 60;
    const fontFamily = 'Arial, sans-serif';

    ctx.font = `bold ${fontSize}px ${fontFamily}`;

    const lines = text.split('\n');
    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    const lineHeight = fontSize * 1.2;
    const height = lineHeight * lines.length;

    // 留一点边距
    canvas.width = maxWidth + 20;
    canvas.height = height + 20;

    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, (i + 0.5) * lineHeight + 10);
    });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const points = [];
    const step = 4; // 采样步长，越小粒子越密

    // 计算缩放比例：将文字总宽度限制在世界坐标系宽度的 2/3 左右
    // 在 z=30, fov=60 的情况下，视口高度约为 34.6
    // 假设宽高比 1.0 (保守估计)，视口宽度约为 34.6
    // 设定目标文字宽度为 25 (留出边距)
    const targetWidth = 25;
    const scale = targetWidth / canvas.width;

    for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
            const alpha = data[(y * canvas.width + x) * 4 + 3];
            if (alpha > 128) {
                // 映射到 3D 坐标
                points.push(new THREE.Vector3(
                    (x - canvas.width / 2) * scale,
                    -(y - canvas.height / 2) * scale, // y 翻转
                    0
                ));
            }
        }
    }
    return points;
}

function createRibbon() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffd700 });

    const count = 300;
    const loops = 4;
    const height = 15;

    ribbonMesh = new THREE.InstancedMesh(geometry, material, count);
    scene.add(ribbonMesh);

    for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 2 * loops;
        const y = t * height - 8;
        const radius = 8.5 * (1 - t);

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        ribbonData.push({
            targetPos: new THREE.Vector3(x, y, z),
            scatterPos: new THREE.Vector3((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60),
            currentPos: new THREE.Vector3((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50),
            id: i
        });

        dummy.position.copy(ribbonData[i].currentPos);
        dummy.updateMatrix();
        ribbonMesh.setMatrixAt(i, dummy.matrix);
    }
}

function createOrnaments() {
    const geometry = new THREE.OctahedronGeometry(0.2, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // 随机分布在树表面
    // 为了让分布在圆锥表面均匀，需要根据表面积采样
    const count = 100;
    const height = 15;
    const baseRadius = 8;
    const yOffset = -8;

    starMesh = new THREE.InstancedMesh(geometry, material, count);
    scene.add(starMesh);

    for (let i = 0; i < count; i++) {
        const u = Math.random();
        // 使用平方根分布使得底部点多，顶部点少，从而在圆锥面上均匀分布
        // h_ratio = 1 - sqrt(u)
        const hRatio = 1 - Math.sqrt(u); // 0 (底部) -> 1 (顶部)

        const y = hRatio * height + yOffset;
        const radius = baseRadius * (1 - hRatio); // 随高度线性减小

        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        starData.push({
            targetPos: new THREE.Vector3(x, y, z),
            scatterPos: new THREE.Vector3((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60),
            currentPos: new THREE.Vector3((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50),
            id: i
        });

        dummy.position.copy(starData[i].currentPos);
        dummy.updateMatrix();
        starMesh.setMatrixAt(i, dummy.matrix);
    }

    // 树顶大星星 (单独 Mesh 因为尺寸不同，或者作为 InstancedMesh 但 scale 不同)
    // 为了简单和统一，这里单独创建一个 Mesh，反正只有一个
    const topStarGeo = new THREE.OctahedronGeometry(0.8, 0);
    const topStarMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    topStarMesh = new THREE.Mesh(topStarGeo, topStarMat);
    topStarMesh.position.set(0, 20, 0);
    topStarMesh.userData = {
        targetPos: new THREE.Vector3(0, 7.5, 0),
        scatterPos: new THREE.Vector3(0, 25, 0),
        currentPos: new THREE.Vector3(0, 20, 0),
        id: 999
    };
    scene.add(topStarMesh);
}

function createSnow() {
    const geometry = new THREE.SphereGeometry(0.1, 4, 4); // 降低细分度
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const count = 800;

    snowMesh = new THREE.InstancedMesh(geometry, material, count);
    scene.add(snowMesh);

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 60;
        const y = (Math.random() - 0.5) * 40 + 10;
        const z = (Math.random() - 0.5) * 60;

        snowData.push({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                -(Math.random() * 0.05 + 0.02),
                (Math.random() - 0.5) * 0.02
            ),
            scatterPos: new THREE.Vector3(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            ),
            currentPos: new THREE.Vector3(x, y, z),
            // 初始值先随便给，后面 onWindowResize 会更新
            resetY: 20,
            bottomY: -20,
            id: i
        });

        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        snowMesh.setMatrixAt(i, dummy.matrix);
    }

    // 立即计算一次边界
    updateSnowBounds();
}

function updateSnowBounds() {
    // 计算当前相机视野在 z=0 处的高度
    // visible_height = 2 * tan(fov/2) * distance
    const vFov = camera.fov * Math.PI / 180;
    const distance = camera.position.z; // 假设雪花主要在 z=0 附近
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;

    const topY = visibleHeight / 2;
    const bottomY = -visibleHeight / 2;

    // 更新所有雪花粒子的边界
    snowData.forEach(p => {
        p.resetY = topY + 5;   // 比屏幕上沿高一点
        p.bottomY = bottomY - 5; // 比屏幕下沿低一点
    });
}

// --- MediaPipe 设置 ---

async function setupMediaPipe() {
    const videoElement = document.getElementById('input_video');

    const hands = new window.Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0, // 性能优先
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onHandsResults);

    // 使用原生 getUserMedia 以支持 facingMode: 'user' (前置摄像头)
    const constraints = {
        video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 }
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
            requestAnimationFrame(processVideo);
        };
    } catch (err) {
        console.error('Error accessing camera:', err);
        // 如果摄像头失败，依然可以看动画，只是没交互
        // 可以选择显示一个提示
    }

    async function processVideo() {
        // 确保视频有数据
        if (videoElement.readyState >= 2) {
            await hands.send({image: videoElement});
        }
        // 继续循环
        // 注意：如果页面隐藏/后台，requestAnimationFrame 会暂停，这也是期望的行为
        if (!videoElement.paused && !videoElement.ended) {
            requestAnimationFrame(processVideo);
        }
    }
}

function onHandsResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // 1. 手势识别
        const wrist = landmarks[0];
        const tips = [8, 12, 16, 20];
        let curledFingers = 0;

        const palmSize = distance(landmarks[0], landmarks[9]);
        const curlThreshold = palmSize * 1.2;

        tips.forEach(tipIdx => {
            const dist = distance(landmarks[0], landmarks[tipIdx]);
            if (dist < curlThreshold) {
                curledFingers++;
            }
        });

        const thumbDist = distance(landmarks[4], landmarks[17]);
        if (thumbDist < palmSize) curledFingers++;

        // 状态判定
        if (curledFingers >= 4) {
            currentTreeState = STATE.TREE_COLLAPSED;
            currentSnowState = STATE.TREE_COLLAPSED;
        } else if (curledFingers <= 1) {
            currentTreeState = STATE.TREE_SCATTERED;
            currentSnowState = STATE.TREE_SCATTERED;
        }

        // 2. 相机控制
        const handX = landmarks[9].x;
        const handY = landmarks[9].y;

        const ndcX = (1 - handX) * 2 - 1;
        const ndcY = -(handY * 2 - 1);

        const aspect = window.innerWidth / window.innerHeight;
        let radius = aspect < 1 ? 30 / aspect * 0.8 : 30;

        // 远近控制：手越近(palmSize越大)，相机越近(radius越小)
        // 限制缩放比例，防止过近或过远
        // const zoomScale = Math.max(0.05, Math.min(2.5, palmSize / 0.24));
        const zoomScale = palmSize / basePalmSize;
        radius *= zoomScale;

        const theta = - ndcX * Math.PI * 0.25; // 水平旋转
        const phi = - ndcY * (Math.PI * 0.25); // 垂直旋转，限制角度防止过顶

        // 球坐标转换: x = r * cos(phi) * sin(theta), y = r * sin(phi), z = r * cos(phi) * cos(theta)
        // 这里的 phi 是仰角（从水平面开始计算），theta 是方位角
        targetCameraPos.x = radius * Math.cos(phi) * Math.sin(theta);
        targetCameraPos.y = radius * Math.sin(phi);
        targetCameraPos.z = radius * Math.cos(phi) * Math.cos(theta);

    } else {
        // 未检测到手时
        // 相机缓慢回到初始位置
        const aspect = window.innerWidth / window.innerHeight;
        const radius = aspect < 1 ? 30 / aspect * 0.8 : 30;
        targetCameraPos.set(0, 0, radius);

        // 自动播放效果：周期性地散开和合拢，模拟呼吸感
        // const time = clock.getElapsedTime();
        // if (Math.sin(time * 0.5) > 0.8) {
        //     currentTreeState = STATE.TREE_SCATTERED;
        //     currentSnowState = STATE.TREE_SCATTERED;
        // } else {
        //     currentTreeState = STATE.TREE_COLLAPSED;
        //     currentSnowState = STATE.TREE_COLLAPSED;
        // }
        // 或者简单保持在合拢态（当前默认逻辑）
        currentTreeState = STATE.TREE_COLLAPSED;
        currentSnowState = STATE.TREE_COLLAPSED;
    }
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
}

// --- 动画循环 ---

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // 1. 更新相机
    camera.position.lerp(targetCameraPos, 0.05);
    camera.lookAt(0, 0, 0);

    // 2. 更新粒子状态 (InstancedMesh)
    updateInstancedParticles(treeMesh, treeData, currentTreeState, delta);
    updateInstancedParticles(ribbonMesh, ribbonData, currentTreeState, delta);
    updateInstancedParticles(starMesh, starData, currentTreeState, delta);

    // 单独更新大星星
    updateSingleParticle(topStarMesh, currentTreeState, delta);

    // 3. 更新雪花
    updateSnow(delta);

    // 4. 渲染
    composer.render();
}

function updateInstancedParticles(mesh, data, state, delta) {
    const speed = 2.0 * delta;
    const time = clock.getElapsedTime();

    for (let i = 0; i < data.length; i++) {
        const p = data[i];
        let target = new THREE.Vector3();

        if (state === STATE.TREE_COLLAPSED) {
            target.copy(p.targetPos);
            const offset = p.id * 0.1;
            target.x += Math.sin(time * 0.5 + offset) * 0.5;
            target.y += Math.cos(time * 0.3 + offset) * 0.5;
            target.z += Math.sin(time * 0.7 + offset) * 0.5;
        } else {
            // 散开态
            if (p.isTextParticle) {
                // 如果是文字粒子，飞向文字位置
                target.copy(p.textPos);
                // 文字也有一点点微动，更生动
                const offset = p.id * 0.1;
                target.x += Math.sin(time * 2.0 + offset) * 0.1;
                target.y += Math.cos(time * 1.5 + offset) * 0.1;
                target.z += Math.sin(time * 1.0 + offset) * 0.1;
            } else {
                // 普通散开
                target.copy(p.scatterPos);
                const offset = p.id * 0.1;
                target.x += Math.sin(time * 0.5 + offset) * 2.0;
                target.y += Math.cos(time * 0.3 + offset) * 2.0;
                target.z += Math.sin(time * 0.7 + offset) * 2.0;
            }
        }

        // 平滑移动
        p.currentPos.lerp(target, speed);

        // 设置矩阵
        dummy.position.copy(p.currentPos);
        dummy.rotation.set(time + p.id, time + p.id, 0); // 简单旋转
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
}

function updateSingleParticle(mesh, state, delta) {
    const speed = 2.0 * delta;
    const time = clock.getElapsedTime();
    let target = new THREE.Vector3();
    const p = mesh.userData;

    if (state === STATE.TREE_COLLAPSED) {
        target.copy(p.targetPos);
    } else {
        target.copy(p.scatterPos);
    }

    // 微动
    target.y += Math.sin(time) * 0.5;

    mesh.position.lerp(target, speed);
    mesh.rotation.y += delta;
}

function updateSnow(delta) {
    const time = clock.getElapsedTime();

    for (let i = 0; i < snowData.length; i++) {
        const p = snowData[i];

        if (currentSnowState === STATE.TREE_COLLAPSED) {
            // 下落态
            p.currentPos.addScaledVector(p.velocity, 1);
            if (p.currentPos.y < p.bottomY) {
                p.currentPos.y = p.resetY;
                p.currentPos.x = (Math.random() - 0.5) * 60;
                p.currentPos.z = (Math.random() - 0.5) * 60;
            }
        } else {
            // 散开态
            let target = p.scatterPos.clone();
            const offset = p.id * 0.1;
            target.x += Math.sin(time * 0.5 + offset) * 2.0;
            target.y += Math.cos(time * 0.3 + offset) * 2.0;
            target.z += Math.sin(time * 0.7 + offset) * 2.0;

            p.currentPos.lerp(target, delta);
        }

        dummy.position.copy(p.currentPos);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        snowMesh.setMatrixAt(i, dummy.matrix);
    }
    snowMesh.instanceMatrix.needsUpdate = true;
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // 响应式调整距离
    const baseZ = aspect < 1 ? 30 / aspect * 0.8 : 30;
    targetCameraPos.z = baseZ;

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

    // 更新雪花边界
    updateSnowBounds();

    // 更新设备参数
    checkDevice();
}

function checkDevice() {
    isMobile = window.innerWidth < 768;
    basePalmSize = isMobile ? 0.48 : 0.24;
}

// 启动
// init();

// 等待用户点击开始按钮再启动
document.getElementById('start-btn').addEventListener('click', () => {
    const modal = document.getElementById('intro-modal');
    modal.classList.add('hidden');

    // 如果还没初始化过，才初始化
    if (!scene) {
        init();
        document.getElementById('start-btn').innerText = "继续体验"; // 改个文字
    }
});

// 帮助按钮点击
document.getElementById('help-btn').addEventListener('click', () => {
    const modal = document.getElementById('intro-modal');
    modal.classList.remove('hidden');
});
