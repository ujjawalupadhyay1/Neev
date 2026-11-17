import fs from 'fs';
import { PNG } from 'pngjs';

const inputPath = 'public/brand/neev-emblem-exact.png';
const outputPath = 'public/brand/neev-emblem-transparent.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function () {
    console.log(`Image dimensions: ${this.width} x ${this.height}`);

    // Check corner pixel color (background)
    const idx0 = 0;
    const r0 = this.data[idx0];
    const g0 = this.data[idx0 + 1];
    const b0 = this.data[idx0 + 2];
    console.log(`Top-left pixel RGB: (${r0}, ${g0}, ${b0})`);

    // Let's sample edges to get background color range
    let bgR = 0, bgG = 0, bgB = 0, count = 0;
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        const idx = (this.width * y + x) << 2;
        bgR += this.data[idx];
        bgG += this.data[idx + 1];
        bgB += this.data[idx + 2];
        count++;
      }
    }
    bgR = Math.round(bgR / count);
    bgG = Math.round(bgG / count);
    bgB = Math.round(bgB / count);
    console.log(`Average corner background RGB: (${bgR}, ${bgG}, ${bgB})`);

    // Flood fill or thresholding with smooth alpha feathering for background
    // Notice: The white door in the house (RGB ~ 255, 255, 255) must NOT be made transparent if it's inside the house!
    // So flood-fill from edges (x=0, y=0, etc.) is the BEST and SAFEST approach!
    const visited = new Uint8Array(this.width * this.height);
    const queue = [];

    // Push all 4 border pixels into queue
    for (let x = 0; x < this.width; x++) {
      queue.push([x, 0]);
      queue.push([x, this.height - 1]);
      visited[0 * this.width + x] = 1;
      visited[(this.height - 1) * this.width + x] = 1;
    }
    for (let y = 0; y < this.height; y++) {
      queue.push([0, y]);
      queue.push([this.width - 1, y]);
      visited[y * this.width + 0] = 1;
      visited[y * this.width + (this.width - 1)] = 1;
    }

    // Is pixel close to background color?
    function isBg(r, g, b) {
      // Background is warm off-white / light cream (~240 to 255)
      // Check distance from (bgR, bgG, bgB) or brightness > 230 and saturation low
      const diff = Math.max(Math.abs(r - bgR), Math.abs(g - bgG), Math.abs(b - bgB));
      if (diff < 35) return true;
      if (r > 230 && g > 230 && b > 230 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) return true;
      return false;
    }

    let head = 0;
    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      const cIdx = (this.width * cy + cx) << 2;
      const cr = this.data[cIdx];
      const cg = this.data[cIdx + 1];
      const cb = this.data[cIdx + 2];

      if (isBg(cr, cg, cb)) {
        // Calculate distance from background for soft edge
        const dist = Math.hypot(cr - bgR, cg - bgG, cb - bgB);
        if (dist < 18) {
          this.data[cIdx + 3] = 0; // Fully transparent
        } else {
          // Smooth feathering
          const alpha = Math.min(255, Math.max(0, Math.round(((dist - 18) / 17) * 255)));
          this.data[cIdx + 3] = alpha;
        }

        // Check 4 neighbors
        const neighbors = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
            const nPos = ny * this.width + nx;
            if (!visited[nPos]) {
              visited[nPos] = 1;
              const nIdx = nPos << 2;
              const nr = this.data[nIdx];
              const ng = this.data[nIdx + 1];
              const nb = this.data[nIdx + 2];
              if (isBg(nr, ng, nb)) {
                queue.push([nx, ny]);
              }
            }
          }
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log(`Saved transparent emblem to ${outputPath}`);
    });
  });

