// Sistema de Validação de Formulários
class FormValidator {
    constructor(formId) {
        this.formId = formId;
        this.form = document.getElementById(formId);
        this.rules = this.getValidationRules();
        this.init();
    }

    init() {
        if (this.form) {
            // Adiciona validação em tempo real
            this.form.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
            
            // Adiciona validação ao perder o foco
            this.form.addEventListener('blur', (e) => {
                this.validateField(e.target);
            }, true);
        }
    }

    getValidationRules() {
        const rules = {
            'user-form': {
                'nome': {
                    required: true,
                    minLength: 2,
                    maxLength: 100,
                    pattern: /^[A-Za-zÀ-ÿ\s]+$/,
                    message: 'Nome deve conter apenas letras e espaços (2-100 caracteres)'
                },
                'email': {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Digite um e-mail válido'
                },
                'idade': {
                    required: true,
                    min: 18,
                    max: 120,
                    message: 'Idade deve ser entre 18 e 120 anos'
                },
                'telefone': {
                    required: true,
                    pattern: /^[0-9]{10,11}$/,
                    message: 'Telefone deve conter 10 ou 11 dígitos'
                }
            },
            'product-form': {
                'produto-nome': {
                    required: true,
                    minLength: 2,
                    maxLength: 100,
                    message: 'Nome do produto deve ter 2-100 caracteres'
                },
                'produto-categoria': {
                    required: true,
                    message: 'Selecione uma categoria'
                },
                'produto-preco': {
                    required: true,
                    min: 0.01,
                    message: 'Preço deve ser maior que zero'
                },
                'produto-estoque': {
                    required: true,
                    min: 0,
                    message: 'Estoque não pode ser negativo'
                }
            },
            'contact-form': {
                'contato-nome': {
                    required: true,
                    minLength: 2,
                    maxLength: 100,
                    message: 'Nome deve ter 2-100 caracteres'
                },
                'contato-email': {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Digite um e-mail válido'
                },
                'contato-assunto': {
                    required: true,
                    message: 'Selecione um assunto'
                },
                'contato-mensagem': {
                    required: true,
                    minLength: 10,
                    message: 'Mensagem deve ter pelo menos 10 caracteres'
                }
            }
        };
        
        return rules[this.formId] || {};
    }

    validate() {
        if (!this.form) return false;
        
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const fieldName = field.name;
        const rules = this.rules[fieldName];
        
        if (!rules) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Validação de campo obrigatório
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        
        // Validação de comprimento mínimo
        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message || `Mínimo ${rules.minLength} caracteres`;
        }
        
        // Validação de comprimento máximo
        if (isValid && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.message || `Máximo ${rules.maxLength} caracteres`;
        }
        
        // Validação de padrão (regex)
        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message || 'Formato inválido';
        }
        
        // Validação de valor mínimo
        if (isValid && rules.min !== undefined && parseFloat(value) < rules.min) {
            isValid = false;
            errorMessage = rules.message || `Valor mínimo: ${rules.min}`;
        }
        
        // Validação de valor máximo
        if (isValid && rules.max !== undefined && parseFloat(value) > rules.max) {
            isValid = false;
            errorMessage = rules.message || `Valor máximo: ${rules.max}`;
        }
        
        // Atualiza a interface
        this.updateFieldStatus(field, isValid, errorMessage);
        
        return isValid;
    }

    updateFieldStatus(field, isValid, errorMessage) {
        // Remove classes anteriores
        field.classList.remove('error', 'valid');
        
        // Remove mensagem de erro anterior
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (isValid) {
            field.classList.add('valid');
        } else {
            field.classList.add('error');
            
            // Adiciona mensagem de erro
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.id = `${field.name}-error`;
            field.parentNode.appendChild(errorElement);
        }
    }

    reset() {
        if (this.form) {
            this.form.reset();
            
            // Remove todas as mensagens de erro
            const errorMessages = this.form.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.remove());
            
            // Remove classes de validação
            const fields = this.form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.classList.remove('error', 'valid');
            });
        }
    }
}