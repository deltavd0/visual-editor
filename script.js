const canvas = document.getElementById("canvas");
const tools = document.querySelectorAll(".tool");

let selected = null;

/* =========================
   CREAR FORMA
========================= */
function createShape(type, x = 50, y = 50) {
  const el = document.createElement("div");
  el.classList.add("shape");

  el.style.width = "100px";
  el.style.height = "100px";
  el.style.left = x + "px";
  el.style.top = y + "px";

  if (type === "circle") el.style.borderRadius = "50%";
  if (type === "triangle") el.classList.add("triangle");

  canvas.appendChild(el);

  addHandles(el);
  enableDrag(el);
  enableResize(el);

  select(el);
}

/* =========================
   CLICK BOTÓN
========================= */
tools.forEach(tool => {
  tool.addEventListener("click", () => {
    createShape(tool.dataset.shape);
  });
});

/* =========================
   DRAG DESDE SIDEBAR
========================= */
tools.forEach(tool => {
  interact(tool).draggable({
    listeners: {
      move(event) {
        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (
          x > 0 && x < rect.width &&
          y > 0 && y < rect.height
        ) {
          createShape(tool.dataset.shape, x, y);
        }
      }
    }
  });
});

/* =========================
   SELECCIÓN
========================= */
function select(el) {
  document.querySelectorAll(".shape").forEach(s => {
    s.classList.remove("selected");
    toggleHandles(s, false);
  });

  selected = el;
  el.classList.add("selected");
  toggleHandles(el, true);
}

canvas.addEventListener("mousedown", e => {
  if (!e.target.classList.contains("shape")) {
    deselect();
  }
});

function deselect() {
  if (selected) {
    selected.classList.remove("selected");
    toggleHandles(selected, false);
  }
  selected = null;
}

/* =========================
   HANDLES
========================= */
function addHandles(el) {
  const positions = ["tl","tr","bl","br","tm","bm","ml","mr"];

  positions.forEach(pos => {
    const h = document.createElement("div");
    h.classList.add("handle", pos);
    h.style.display = "none";
    el.appendChild(h);
  });
}

function toggleHandles(el, show) {
  el.querySelectorAll(".handle").forEach(h => {
    h.style.display = show ? "block" : "none";
  });
}

/* =========================
   DRAG (LIMITADO)
========================= */
function enableDrag(el) {
  interact(el).draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: canvas
      })
    ],
    listeners: {
      move(event) {
        const t = event.target;

        let x = parseFloat(t.style.left);
        let y = parseFloat(t.style.top);

        x += event.dx;
        y += event.dy;

        t.style.left = x + "px";
        t.style.top = y + "px";
      }
    }
  });

  el.addEventListener("mousedown", () => select(el));
}

/* =========================
   RESIZE
========================= */
function enableResize(el) {
  interact(el).resizable({
    edges: { top: true, left: true, bottom: true, right: true },

    modifiers: [
      interact.modifiers.restrictEdges({
        outer: canvas
      })
    ],

    listeners: {
      move(event) {
        let x = parseFloat(event.target.style.left);
        let y = parseFloat(event.target.style.top);

        event.target.style.width = event.rect.width + "px";
        event.target.style.height = event.rect.height + "px";

        x += event.deltaRect.left;
        y += event.deltaRect.top;

        event.target.style.left = x + "px";
        event.target.style.top = y + "px";
      }
    }
  });
}