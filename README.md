# 🏪 STOKA

Uma plataforma de gestão empresarial desenvolvida para auxiliar pequenas empresas no controle de estoque, vendas, tarefas e análise de dados.

## 📋 Sobre o Projeto

A **STOKA** é uma aplicação web moderna que oferece uma solução integrada para gestão empresarial, permitindo que empreendedores controlem seus negócios de forma eficiente através de uma interface intuitiva e responsiva.

### 🎯 Objetivo

Facilitar a gestão empresarial através de uma plataforma única que integra:
- Controle de estoque em tempo real
- Gestão de vendas e análise de lucros
- Sistema de tarefas e lembretes
- Dashboard com métricas e gráficos
- Autenticação segura de usuários

## ✨ Funcionalidades Principais

### 📊 Dashboard
- **Visão Geral**: Métricas em tempo real do negócio
- **Gráficos Interativos**: Visualização de dados de vendas, estoque e lucros
- **Análise de Categorias**: Distribuição de produtos por categoria
- **Busca Rápida**: Localização instantânea de produtos e tarefas
- **Resumo Financeiro**: Saldo, lucros e perdas

### 📦 Gestão de Estoque
- **Cadastro de Produtos**: Registro completo com nome, categoria, quantidade e preço
- **Controle de Quantidade**: Acompanhamento automático do estoque
- **Categorização**: Organização por categorias (Eletrônicos, Vestuário, Alimentos, etc.)
- **Valor Total**: Cálculo automático do valor total do estoque
- **Histórico**: Snapshots do estoque para análise temporal

### 💰 Gestão de Vendas
- **Registro de Vendas**: Controle de transações com produtos
- **Cálculo de Lucros**: Análise automática de lucros e perdas
- **Relatórios**: Visualização de performance de vendas
- **Integração com Estoque**: Atualização automática do estoque

### ✅ Sistema de Tarefas
- **Criação de Tarefas**: Título, descrição e prioridade
- **Controle de Status**: Pendente, em andamento, concluída
- **Datas de Vencimento**: Controle de prazos
- **Prioridades**: Baixa, média, alta
- **Filtros**: Organização por status e prioridade

### ⚙️ Configurações
- **Perfil do Usuário**: Gerenciamento de dados pessoais
- **Preferências**: Configurações da plataforma e de segurança da conta [EM BREVE]

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.3.3** - Framework React para aplicações web
- **React 18.2.0** - Biblioteca para interfaces de usuário
- **TypeScript 5.3.3** - Linguagem tipada para JavaScript
- **Tailwind CSS 3.4.1** - Framework CSS utilitário
- **Headless UI 2.2.4** - Componentes acessíveis e sem estilo

### Backend & Banco de Dados
- **Firebase 11.10.0** - Plataforma de desenvolvimento do Google
  - **Firestore** - Banco de dados NoSQL em tempo real
  - **Authentication** - Sistema de autenticação seguro

### Bibliotecas de UI/UX
- **React Icons 5.0.1** - Ícones para React
- **Recharts 3.1.0** - Biblioteca de gráficos para React
- **React DatePicker 8.4.0** - Seletor de datas

### Ferramentas de Desenvolvimento
- **ESLint 8.56.0** - Linter para JavaScript/TypeScript
- **PostCSS 8.4.35** - Processador de CSS
- **Autoprefixer 10.4.17** - Prefixos CSS automáticos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Firebase (para configuração do banco de dados)

### Instalação

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd plataform-stoka
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Configure Authentication e Firestore
   - Copie as credenciais para `src/firebaseConfig.ts`

4. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação**
   - Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar código

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop**: Interface completa com sidebar expandida
- **Tablet**: Sidebar colapsível
- **Mobile**: Interface otimizada para dispositivos móveis

## 🔐 Autenticação

O sistema utiliza Firebase Authentication para:
- Login com email e senha
- Registro de novos usuários
- Recuperação de senha
- Controle de sessão seguro

## 📊 Estrutura do Projeto

```
plataform-stoka/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Auth/           # Componentes de autenticação
│   │   ├── sections/       # Seções da aplicação
│   │   └── Sidebar.tsx     # Navegação lateral
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas Next.js
│   ├── types/              # Definições TypeScript
│   ├── styles/             # Estilos globais
│   └── firebaseConfig.ts   # Configuração Firebase
├── public/                 # Arquivos estáticos
└── package.json           # Dependências e scripts
```

## 🎨 Design System

A aplicação utiliza um design system consistente com:
- **Cores**: Paleta de cores moderna e profissional
- **Tipografia**: Hierarquia clara de textos
- **Componentes**: Reutilizáveis e acessíveis
- **Ícones**: React Icons para consistência visual

## 🔄 Funcionalidades Futuras

- [ ] Relatórios em PDF
- [ ] Integração com APIs de pagamento
- [ ] Sistema de notificações push
- [ ] Backup automático de dados
- [ ] Múltiplos usuários por empresa
- [ ] API REST para integrações externas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, entre em contato antes de enviar pull requests.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através das minhas redes.




