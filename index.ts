const w : number = window.innerWidth 
const h : number = window.innerHeight
const parts : number = 3 
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 8.9 
const delay : number = 20
const backColor : string = "#bdbdbd"
const lines : number = 6 
const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#4CAF50",
    "#3F51B5"
]

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawOscillatingLine(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const size : number = Math.min(w, h) / sizeFactor
        const gap : number = size / (2 * lines)
        context.save()
        context.translate(0, h)
        for (var j = 0; j < lines; j++) {
            const sfi : number = ScaleUtil.divideScale(sc2, j, lines)
            context.save()
            context.translate(gap + gap * j + gap * sfi, 0)
            DrawingUtil.drawLine(context, 0, -h * sc3, 0, h * sc1)
            context.restore()
        }
        context.restore()
    }

    static drawOSLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawOscillatingLine(context, scale)
    }
}

class Stage {
    
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
    
    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0 
            this.prevScale = this.scale 
            cb() 
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}