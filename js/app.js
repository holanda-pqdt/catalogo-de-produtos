// Aplicação principal - Catálogo de Produtos
console.log('=== APP INICIANDO ===');

class App {
    constructor() {
        console.log('App constructor chamado');
        this.init();
    }

    init() {
        console.log('App init chamado');
        
        // Inicializações
        this.storage = new Storage();
        this.router = new Router();
        
        // Configura os validadores
        this.formValidators = {};
        
        // Configura os event listeners
        this.setupEventListeners();
        
        // Mostra informações de debug
        this.showDebugInfo();
        
        console.log('App inicializado com sucesso!');
    }

    setupEventListeners() {
        // Event listener global para formulários
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (e.target.id === 'user-form') {
                this.handleUserSubmit(e);
            } else if (e.target.id === 'product-form') {
                this.handleProductSubmit(e);
            } else if (e.target.id === 'contact-form') {
                this.handleContactSubmit(e);
            }
        });

        // Event listener para deletar itens
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                const itemType = e.target.getAttribute('data-type');
                
                if (itemType === 'user') {
                    this.deleteUser(itemId);
                } else if (itemType === 'product') {
                    this.deleteProduct(itemId);
                }
            }
        });
    }

    // ========== MANIPULAÇÃO DE USUÁRIOS ==========
    handleUserSubmit(e) {
        console.log('Tentando cadastrar usuário...');
        
        // Inicializa validador se não existir
        if (!this.formValidators.user) {
            this.formValidators.user = new FormValidator('user-form');
        }
        
        if (this.formValidators.user.validate()) {
            const formData = new FormData(e.target);
            const userData = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                idade: parseInt(formData.get('idade')),
                telefone: formData.get('telefone')
            };
            
            console.log('Dados do usuário:', userData);
            
            const usuarioSalvo = this.storage.saveUser(userData);
            
            if (usuarioSalvo) {
                this.updateUserList();
                e.target.reset();
                this.showNotification('✅ Usuário cadastrado com sucesso!', 'success');
                console.log('Usuário salvo no storage');
            } else {
                this.showNotification('❌ Erro ao cadastrar usuário!', 'error');
            }
        } else {
            this.showNotification('⚠️ Corrija os erros no formulário!', 'error');
        }
    }

    // ========== MANIPULAÇÃO DE PRODUTOS ==========
    handleProductSubmit(e) {
        console.log('Tentando cadastrar produto...');
        
        if (!this.formValidators.product) {
            this.formValidators.product = new FormValidator('product-form');
        }
        
        if (this.formValidators.product.validate()) {
            const formData = new FormData(e.target);
            const productData = {
                nome: formData.get('produto-nome'),
                preco: parseFloat(formData.get('produto-preco')),
                estoque: parseInt(formData.get('produto-estoque')),
                categoria: formData.get('produto-categoria') || 'geral'
            };
            
            console.log('Dados do produto:', productData);
            
            const produtoSalvo = this.storage.saveProduct(productData);
            
            if (produtoSalvo) {
                this.updateProductList();
                e.target.reset();
                this.showNotification('✅ Produto cadastrado com sucesso!', 'success');
                console.log('Produto salvo no storage');
            } else {
                this.showNotification('❌ Erro ao cadastrar produto!', 'error');
            }
        } else {
            this.showNotification('⚠️ Corrija os erros no formulário!', 'error');
        }
    }

    // ========== MANIPULAÇÃO DE CONTATOS ==========
    handleContactSubmit(e) {
        console.log('Tentando enviar contato...');
        
        if (!this.formValidators.contact) {
            this.formValidators.contact = new FormValidator('contact-form');
        }
        
        if (this.formValidators.contact.validate()) {
            const formData = new FormData(e.target);
            const contactData = {
                nome: formData.get('contato-nome'),
                email: formData.get('contato-email'),
                mensagem: formData.get('contato-mensagem')
            };
            
            console.log('Dados do contato:', contactData);
            
            const contatoSalvo = this.storage.saveContato(contactData);
            
            if (contatoSalvo) {
                e.target.reset();
                this.showNotification('✅ Mensagem enviada com sucesso!', 'success');
                console.log('Contato salvo no storage');
            } else {
                this.showNotification('❌ Erro ao enviar mensagem!', 'error');
            }
        } else {
            this.showNotification('⚠️ Corrija os erros no formulário!', 'error');
        }
    }

    // ========== ATUALIZAÇÃO DE LISTAS ==========
    updateUserList() {
        const usersList = document.getElementById('users-list');
        if (!usersList) {
            console.log('Elemento users-list não encontrado');
            return;
        }
        
        const users = this.storage.getUsers();
        console.log('Atualizando lista de usuários:', users.length, 'encontrados');
        
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            usersList.innerHTML = '<p class="no-data">📝 Nenhum usuário cadastrado.</p>';
            return;
        }
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'item-card';
            userCard.innerHTML = `
                <h3>👤 ${user.nome}</h3>
                <p><strong>📧 E-mail:</strong> ${user.email}</p>
                <p><strong>🎂 Idade:</strong> ${user.idade} anos</p>
                <p><strong>📞 Telefone:</strong> ${user.telefone}</p>
                <p><strong>📅 Cadastrado em:</strong> ${user.dataCriacao}</p>
                <button class="delete-btn" data-id="${user.id}" data-type="user">🗑️ Excluir</button>
            `;
            usersList.appendChild(userCard);
        });
        
        this.updateStats();
    }

    updateProductList() {
        const productsList = document.getElementById('products-list');
        if (!productsList) {
            console.log('Elemento products-list não encontrado');
            return;
        }
        
        const products = this.storage.getProducts();
        console.log('Atualizando lista de produtos:', products.length, 'encontrados');
        
        productsList.innerHTML = '';
        
        if (products.length === 0) {
            productsList.innerHTML = '<p class="no-data">📦 Nenhum produto cadastrado.</p>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'item-card';
            productCard.innerHTML = `
                <h3>🏷️ ${product.nome}</h3>
                <p><strong>💰 Preço:</strong> R$ ${product.preco.toFixed(2)}</p>
                <p><strong>📊 Estoque:</strong> ${product.estoque} unidades</p>
                <p><strong>📂 Categoria:</strong> ${product.categoria}</p>
                <p><strong>📅 Cadastrado em:</strong> ${product.dataCriacao}</p>
                <button class="delete-btn" data-id="${product.id}" data-type="product">🗑️ Excluir</button>
            `;
            productsList.appendChild(productCard);
        });
        
        this.updateStats();
    }

    // ========== EXCLUSÃO DE ITENS ==========
    deleteUser(userId) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            this.storage.deleteUser(userId);
            this.updateUserList();
            this.showNotification('👤 Usuário excluído com sucesso!', 'info');
            console.log('Usuário excluído:', userId);
        }
    }

    deleteProduct(productId) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.storage.deleteProduct(productId);
            this.updateProductList();
            this.showNotification('📦 Produto excluído com sucesso!', 'info');
            console.log('Produto excluído:', productId);
        }
    }

    // ========== ESTATÍSTICAS ==========
    updateStats() {
        const stats = this.storage.getEstatisticas();
        
        const userCount = document.getElementById('user-count');
        const productCount = document.getElementById('product-count');
        
        if (userCount) {
            userCount.textContent = stats.totalUsuarios;
            console.log('Contador de usuários atualizado:', stats.totalUsuarios);
        }
        
        if (productCount) {
            productCount.textContent = stats.totalProdutos;
            console.log('Contador de produtos atualizado:', stats.totalProdutos);
        }
    }

    // ========== DEBUG E INFORMAÇÕES ==========
    showDebugInfo() {
        const stats = this.storage.getEstatisticas();
        const debugInfo = `
            <div style="background: #e8f4fd; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3498db;">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">🔍 Informações do Sistema</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: white; padding: 10px; border-radius: 5px;">
                        <strong>👤 Usuários:</strong> ${stats.totalUsuarios}
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 5px;">
                        <strong>📦 Produtos:</strong> ${stats.totalProdutos}
                    </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button onclick="app.viewAllData()" style="background: #3498db; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        📋 Ver Todos os Dados
                    </button>
                    <button onclick="app.clearAllData()" style="background: #e74c3c; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🗑️ Limpar Tudo
                    </button>
                    <button onclick="app.testStorage()" style="background: #27ae60; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🧪 Testar Storage
                    </button>
                </div>
            </div>
        `;
        
        // Adiciona na página inicial
        const main = document.getElementById('main-content');
        if (main && window.location.hash === '#/' || window.location.hash === '') {
            const existingDebug = main.querySelector('.debug-info');
            if (existingDebug) existingDebug.remove();
            
            const debugDiv = document.createElement('div');
            debugDiv.className = 'debug-info';
            debugDiv.innerHTML = debugInfo;
            main.appendChild(debugDiv);
        }
    }

    viewAllData() {
        const users = this.storage.getUsers();
        const products = this.storage.getProducts();
        const contatos = this.storage.getContatos();
        
        const dadosFormatados = `
DADOS ARMAZENADOS NO LOCALSTORAGE:

👤 USUÁRIOS (${users.length}):
${JSON.stringify(users, null, 2)}

📦 PRODUTOS (${products.length}):
${JSON.stringify(products, null, 2)}

📧 CONTATOS (${contatos.length}):
${JSON.stringify(contatos, null, 2)}
        `;
        
        // Cria um popup para mostrar os dados
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 90%;
            max-height: 80%;
            overflow: auto;
            font-family: monospace;
            font-size: 12px;
        `;
        
        popup.innerHTML = `
            <h3 style="margin-top: 0;">📊 Dados Armazenados</h3>
            <pre style="white-space: pre-wrap; background: #f8f9fa; padding: 10px; border-radius: 4px;">${dadosFormatados}</pre>
            <button onclick="this.parentElement.remove()" style="background: #e74c3c; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                Fechar
            </button>
        `;
        
        document.body.appendChild(popup);
    }

    clearAllData() {
        if (confirm('🚨 ATENÇÃO! Isso vai apagar TODOS os usuários, produtos e contatos. Esta ação não pode ser desfeita. Continuar?')) {
            this.storage.limparTodosDados();
            this.updateStats();
            this.updateUserList();
            this.updateProductList();
            this.showNotification('🗑️ Todos os dados foram apagados!', 'info');
            console.log('Todos os dados limpos');
        }
    }

    testStorage() {
        // Teste automático do storage
        console.log('🧪 Iniciando teste do storage...');
        
        // Teste de usuário
        const testUser = {
            nome: 'Usuário Teste',
            email: 'teste@email.com',
            idade: 25,
            telefone: '11999999999'
        };
        
        const userSalvo = this.storage.saveUser(testUser);
        console.log('Teste usuário:', userSalvo ? '✅ OK' : '❌ FALHOU');
        
        // Teste de produto
        const testProduct = {
            nome: 'Produto Teste',
            preco: 99.99,
            estoque: 10,
            categoria: 'teste'
        };
        
        const productSalvo = this.storage.saveProduct(testProduct);
        console.log('Teste produto:', productSalvo ? '✅ OK' : '❌ FALHOU');
        
        // Atualiza as listas
        this.updateUserList();
        this.updateProductList();
        this.updateStats();
        
        this.showNotification('🧪 Teste do storage realizado! Verifique o console.', 'success');
    }

    // ========== NOTIFICAÇÕES ==========
    showNotification(message, type = 'info') {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease-out',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '300px',
            wordBreak: 'break-word'
        });
        
        // Cores por tipo
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Adiciona ao documento
        document.body.appendChild(notification);
        
        // Remove após 4 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }

    // ========== CARREGAMENTO DE PÁGINAS ==========
    onPageLoad(page) {
        console.log('Carregando página:', page);
        
        switch(page) {
            case 'home':
                this.updateStats();
                this.showDebugInfo();
                break;
            case 'usuarios':
                this.updateUserList();
                // Inicializa validador para esta página
                setTimeout(() => {
                    this.formValidators.user = new FormValidator('user-form');
                }, 100);
                break;
            case 'produtos':
                this.updateProductList();
                // Inicializa validador para esta página
                setTimeout(() => {
                    this.formValidators.product = new FormValidator('product-form');
                }, 100);
                break;
            case 'contato':
                // Inicializa validador para esta página
                setTimeout(() => {
                    this.formValidators.contact = new FormValidator('contact-form');
                }, 100);
                break;
        }
    }
}

// Adiciona estilos de animação para as notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-data {
        text-align: center;
        padding: 20px;
        color: #7f8c8d;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Inicializa a aplicação quando o DOM estiver carregado
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando app...');
    app = new App();
});

// Torna a app global para acesso via console
window.app = app;

console.log('=== APP.JS CARREGADO ===');