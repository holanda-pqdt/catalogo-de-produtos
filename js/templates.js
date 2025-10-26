// Sistema de Templates
class Templates {
    constructor() {
        this.templates = {};
        this.loadTemplates();
    }

    loadTemplates() {
        // Os templates já estão definidos no HTML
        // Esta classe pode ser expandida para carregar templates externos
        console.log('Sistema de templates inicializado');
    }

    get(templateName) {
        const template = document.getElementById(`template-${templateName}`);
        if (template) {
            return document.importNode(template.content, true);
        }
        return null;
    }

    render(templateName, data = {}) {
        const template = this.get(templateName);
        if (!template) return null;

        // Processa placeholders nos templates
        this.processPlaceholders(template, data);
        return template;
    }

    processPlaceholders(element, data) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = this.replacePlaceholders(node.textContent, data);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Processa atributos
                for (let attr of node.attributes) {
                    attr.value = this.replacePlaceholders(attr.value, data);
                }
            }
        }
    }

    replacePlaceholders(text, data) {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    }
}