// Sistema de Roteamento para SPA
class Router {
    constructor() {
        this.routes = {
            '/': 'home',
            '/usuarios': 'usuarios',
            '/produtos': 'produtos',
            '/contato': 'contato'
        };
        
        this.init();
    }

    init() {
        // Configura o listener para mudanças de hash
        window.addEventListener('hashchange', () => this.handleRouteChange());
        
        // Configura os links da navegação
        this.setupNavigation();
        
        // Processa a rota inicial
        this.handleRouteChange();
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('nav a')) {
                e.preventDefault();
                const route = e.target.getAttribute('href').substring(1);
                this.navigate(route);
            }
        });
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1) || '/';
        const route = this.routes[hash];
        
        if (route) {
            this.loadPage(route);
            this.updateActiveLink(hash);
        } else {
            this.loadPage('home');
        }
    }

    navigate(route) {
        window.location.hash = route;
    }

    loadPage(page) {
        const mainContent = document.getElementById('main-content');
        const template = document.getElementById(`template-${page}`);
        
        if (template && mainContent) {
            mainContent.innerHTML = '';
            const content = document.importNode(template.content, true);
            mainContent.appendChild(content);
            
            // Executa ações específicas para cada página
            this.onPageLoad(page);
        }
    }

    updateActiveLink(activeRoute) {
        // Remove a classe active de todos os links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adiciona a classe active ao link correspondente
        const activeLink = document.querySelector(`nav a[href="#${activeRoute}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    onPageLoad(page) {
        switch (page) {
            case 'home':
                if (typeof app !== 'undefined') {
                    app.updateStats();
                }
                break;
            case 'usuarios':
                if (typeof app !== 'undefined') {
                    app.updateUserList();
                }
                break;
            case 'produtos':
                if (typeof app !== 'undefined') {
                    app.updateProductList();
                }
                break;
        }
        
        console.log(`Página carregada: ${page}`);
    }
}