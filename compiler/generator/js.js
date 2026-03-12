class JSGenerator {
  constructor(ast) {
    this.ast = ast;
    this.hasNav = false;
    this.hasModal = false;
    this.hasForms = false;
    this.hasActions = false;
    this.hasFetch = false;
    this.hasState = false;
    this.apis = [];
    this.states = [];
    this.analyze(ast);
  }

  analyze(ast) {
    for (const page of ast.pages) {
      this.scanNodes(page.children);
    }
  }

  scanNodes(nodes) {
    for (const node of nodes) {
      switch (node.type) {
        case "Nav":
          this.hasNav = true;
          break;
        case "Modal":
          this.hasModal = true;
          break;
        case "Form":
          this.hasForms = true;
          break;
        case "Fetch":
          this.hasFetch = true;
          break;
        case "Api":
          this.apis.push(node);
          this.hasFetch = true;
          break;
        case "State":
          this.states.push(node);
          this.hasState = true;
          break;
        case "Button":
          if (node.action && node.action.type === "call") {
            this.hasActions = true;
          }
          break;
      }
      if (node.children) this.scanNodes(node.children);
    }
  }

  needsJS() {
    return (
      this.hasNav ||
      this.hasModal ||
      this.hasForms ||
      this.hasActions ||
      this.hasFetch ||
      this.hasState
    );
  }

  generate() {
    if (!this.needsJS()) return "";

    let js = `// Origin Engine — Generated Script\n\n`;
    js += `document.addEventListener("DOMContentLoaded", function () {\n\n`;

    if (this.hasNav) js += this.navScript();
    if (this.hasModal) js += this.modalScript();
    if (this.hasForms) js += this.formScript();
    if (this.hasActions) js += this.actionScript();
    if (this.hasState) js += this.stateScript();
    if (this.hasFetch) js += this.fetchScript();

    js += `});\n`;
    return js;
  }

  navScript() {
    return `  // Navigation toggle
  var navToggle = document.querySelector(".nav__toggle");
  var navLinks = document.querySelector(".nav__links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("active");
    });
  }

`;
  }

  modalScript() {
    return `  // Modal handling
  function openModal(id) {
    var modal = document.getElementById("modal-" + id);
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(id) {
    var modal = document.getElementById("modal-" + id);
    if (modal) {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("[data-modal-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      var modal = el.closest(".modal");
      if (modal) {
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll('.modal[aria-hidden="false"]').forEach(function (modal) {
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    }
  });

`;
  }

  formScript() {
    return `  // Form handling
  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });
      var event = new CustomEvent("origin:form-submit", {
        detail: { form: form.dataset.form, data: data },
      });
      document.dispatchEvent(event);
    });
  });

`;
  }

  actionScript() {
    return `  // Action handlers
  document.querySelectorAll("[data-action]").forEach(function (el) {
    el.addEventListener("click", function () {
      var action = el.dataset.action;
      var event = new CustomEvent("origin:action", {
        detail: { action: action, element: el },
      });
      document.dispatchEvent(event);

      if (action.startsWith("toggle-")) {
        var targetId = action.replace("toggle-", "");
        openModal(targetId);
      }
    });
  });

`;
  }

  stateScript() {
    let js = `  // Reactive state\n`;
    js += `  var originState = {};\n\n`;

    for (const state of this.states) {
      const defaultVal =
        typeof state.defaultValue === "string"
          ? `"${state.defaultValue}"`
          : state.defaultValue !== null
            ? state.defaultValue
            : "null";
      js += `  originState["${state.name}"] = ${defaultVal};\n`;
    }

    js += `
  var stateProxy = new Proxy(originState, {
    set: function (target, prop, value) {
      target[prop] = value;
      document.querySelectorAll('[data-bind="' + prop + '"]').forEach(function (el) {
        el.textContent = value;
      });
      return true;
    },
  });

  window.originState = stateProxy;

`;
    return js;
  }

  fetchScript() {
    let js = `  // API fetch handling\n`;

    if (this.apis.length > 0) {
      js += `  var apiEndpoints = {\n`;
      for (const api of this.apis) {
        js += `    "${api.name}": "${api.url}",\n`;
      }
      js += `  };\n\n`;
    }

    js += `  document.querySelectorAll("[data-fetch]").forEach(function (container) {
    var target = container.dataset.fetch;
    var url = ${this.apis.length > 0 ? "apiEndpoints[target] || target" : "target"};
    var loading = container.querySelector(".fetch-loading");
    var error = container.querySelector(".fetch-error");
    var content = container.querySelector(".fetch-content");

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed: " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (loading) loading.hidden = true;
        if (content) content.hidden = false;
        var event = new CustomEvent("origin:fetch-complete", {
          detail: { target: target, data: data },
        });
        document.dispatchEvent(event);
      })
      .catch(function (err) {
        if (loading) loading.hidden = true;
        if (error) {
          error.hidden = false;
          error.textContent = err.message;
        }
      });
  });

`;
    return js;
  }
}

module.exports = { JSGenerator };
