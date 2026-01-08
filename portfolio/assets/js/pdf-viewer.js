// assets/js/pdf-viewer.js

// 設定 PDF.js 的 Worker (必要)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null,
    pageNum = 1,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

// 指定 PDF 檔案路徑 (請更換為你的 PDF 檔名)
const pdfPath = 'assets/docs/PortfolioA3.pdf'; 

/**
 * 渲染指定頁面
 */
function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
        document.getElementById('pdf-current-page').textContent = num;
    });
}

/**
 * 載入 PDF 文件
 */
pdfjsLib.getDocument(pdfPath).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.getElementById('pdf-total-pages').textContent = pdfDoc.numPages;
    renderPage(pageNum);
}).catch(err => {
    console.error('PDF 載入錯誤: ', err);
    alert('無法載入 PDF 檔案，請檢查路徑或伺服器設定。');
});

// 按鈕事件監聽
document.getElementById('pdf-prev').addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById('pdf-next').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});