const canvas = document.getElementById('colorCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', {"willReadFrequently": true }) as CanvasRenderingContext2D;
const selectedColorSpan = document.getElementById('selectedColor') as HTMLSpanElement;
const imageInput = document.getElementById('imageInput') as HTMLInputElement;
const colorCircle = document.getElementById('colorCircle') as HTMLDivElement;
const magnifierCanvas = document.getElementById('magnifierCanvas') as HTMLCanvasElement;
const magnifierCtx = magnifierCanvas.getContext('2d', {"willReadFrequently": true }) as CanvasRenderingContext2D;
const hexCodeSpan = document.getElementById('hexCode') as HTMLSpanElement;
const colorDropper = document.getElementById('colorDropper') as HTMLButtonElement;

const TILE_SIZE = 1000;

let isColorDropperEnabled = false;
let canvasClientRect: DOMRect;

imageInput.addEventListener('change', handleImageUpload);
canvas.addEventListener('mouseleave', hideMagnifier);
colorDropper.addEventListener('click', dropperOnClickHandler);
window.addEventListener('resize', updateClientRect)

function handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>): void => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], {type: file.type});
            const url = URL.createObjectURL(blob);
            const img = new Image();

            img.onload = (): void => {
                URL.revokeObjectURL(url);

                drawImageInTiles(img);
                updateClientRect();
            };

            img.onerror = (err: string | Event): void => {
                console.error("Error loading image: ", err);
                alert("Error loading image. Please try a smaller file.");
            };

            img.src = url;
        };

        reader.onerror = (err: ProgressEvent<FileReader>): void => {
            console.error("Error reading file: ", err);
            alert("Error reading file. Please try again.");
        };

        reader.readAsArrayBuffer(file);
    }
}

function drawImageInTiles(img: HTMLImageElement): void {
    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < height; y += TILE_SIZE) {
        for (let x = 0; x < width; x += TILE_SIZE) {
            const tileWidth = Math.min(TILE_SIZE, width - x);
            const tileHeight = Math.min(TILE_SIZE, height - y);
            ctx.drawImage(img, x, y, tileWidth, tileHeight, x, y, tileWidth, tileHeight);
        }
    }
}

function fillMagnifierContent(event: MouseEvent): void {
    const [x, y, hex] = getHexColorData(event);

    applyMagnifierStyles(event, hex);
    drawMagnifier(x, y, hex);
}

function applyMagnifierStyles(event: MouseEvent, hex: string): void {
    colorCircle.style.display = 'flex';
    colorCircle.style.left = `${event.pageX - 85}px`;
    colorCircle.style.top = `${event.pageY - 85}px`;

    hexCodeSpan.textContent = hex;
    colorCircle.style.borderColor = hex;
}

function getHexColorData(event: MouseEvent): [number, number, string] {
    const x = event.clientX - canvasClientRect.left;
    const y = event.clientY - canvasClientRect.top;
    const imageData = ctx.getImageData(x, y, 1, 1).data;

    return [x, y, rgbToHex(imageData[0], imageData[1], imageData[2])];
}

function hideMagnifier(): void {
    colorCircle.style.display = 'none';
}

function fillSelectedHex(event: MouseEvent): void {
    const [,,hex] = getHexColorData(event)
    selectedColorSpan.textContent = hex;
}

function toggleMagnifierListeners(): void {
    isColorDropperEnabled
        ? canvas.removeEventListener('mousemove', fillMagnifierContent)
        : canvas.addEventListener('mousemove', fillMagnifierContent)

    isColorDropperEnabled
        ? canvas.removeEventListener('click', fillSelectedHex)
        : canvas.addEventListener('click', fillSelectedHex);
}

function toggleDropperStyles(): void {
    isColorDropperEnabled
        ? colorDropper.style.border = "1px solid black"
        : colorDropper.style.border = "unset"

    isColorDropperEnabled
        ? canvas.style.cursor = 'none'
        : canvas.style.cursor = 'default'
}

function dropperOnClickHandler(): void {
    toggleMagnifierListeners();

    isColorDropperEnabled = !isColorDropperEnabled;

    toggleDropperStyles();
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function updateClientRect(): void {
    canvasClientRect = canvas.getBoundingClientRect();
}

function drawMagnifier(x: number, y: number, hex: string): void {
    const magnifierSize = 20;
    const scale = 10;
    const startX = Math.max(0, x - magnifierSize / 2);
    const startY = Math.max(0, y - magnifierSize / 2);
    const endX = Math.min(canvas.width, x + magnifierSize / 2);
    const endY = Math.min(canvas.height, y + magnifierSize / 2);

    magnifierCtx.clearRect(0, 0, magnifierCanvas.width, magnifierCanvas.height);

    magnifierCtx.drawImage(
        canvas,
        startX, startY, endX - startX, endY - startY,
        0, 0, magnifierCanvas.width, magnifierCanvas.height
    );

    const centerX = magnifierCanvas.width / 2;
    const centerY = magnifierCanvas.height / 2;

    magnifierCtx.strokeStyle = '#FFFFFF';
    magnifierCtx.lineWidth = 1;
    magnifierCtx.strokeRect(centerX - scale / 2, centerY - scale / 2, scale, scale);

    magnifierCtx.font = '14px Arial';
    magnifierCtx.fillStyle = '#FFFFFF';
    magnifierCtx.fillText(hex, centerX - scale, centerY + scale + 10);
}

