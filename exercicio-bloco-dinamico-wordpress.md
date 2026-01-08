# 🧱 Exercício: Crie seu Primeiro Bloco Dinâmico no WordPress

## 📚 O que são Blocos Dinâmicos?

**Blocos dinâmicos** são blocos do Gutenberg cujo conteúdo é gerado no servidor (PHP) em vez de ser salvo estaticamente no banco de dados. São ideais para exibir dados que mudam frequentemente.

**Diferença principal:**
- **Bloco estático:** salva HTML no banco → `save()` retorna JSX
- **Bloco dinâmico:** gera HTML via PHP → `save()` retorna `null`

---

## 🎯 Seu Desafio

Criar um bloco dinâmico chamado **"Últimos Posts"** com as seguintes funcionalidades:

### Requisitos Obrigatórios

| Requisito | Descrição |
|-----------|-----------|
| ✅ Listar posts | Exibir os posts mais recentes (quantidade configurável) |
| ✅ Controle de quantidade | Slider de 1 a 10 posts na sidebar do editor |
| ✅ Toggle de data | Opção para mostrar/ocultar a data do post |
| ✅ Toggle de resumo | Opção para mostrar/ocultar o excerpt |
| ✅ Preview no editor | O bloco deve mostrar os posts reais no editor |
| ✅ Renderização PHP | O frontend deve ser gerado pelo servidor |

### Resultado Esperado

```
┌─────────────────────────────────────┐
│ 📰 Últimos Posts                    │
├─────────────────────────────────────┤
│ ▸ Título do Post 1                  │
│   25/12/2024                        │
│   Resumo do post aqui...            │
├─────────────────────────────────────┤
│ ▸ Título do Post 2                  │
│   24/12/2024                        │
│   Resumo do post aqui...            │
└─────────────────────────────────────┘
```

---

## 📋 Pré-requisitos

- WordPress instalado localmente
- Node.js 16+
- Conhecimentos básicos de PHP, JavaScript e React

---

## 🛠️ Setup Inicial

### 1. Crie a estrutura de pastas

```
wp-content/plugins/meu-bloco-dinamico/
├── meu-bloco-dinamico.php
├── package.json
└── src/
    ├── block.json
    ├── index.js
    ├── editor.scss
    └── style.scss
```

### 2. Configure o package.json

```json
{
  "name": "meu-bloco-dinamico",
  "version": "1.0.0",
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start"
  },
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0"
  }
}
```

### 3. Instale as dependências

```bash
npm install
```

---

## 📝 Arquivos para Completar

### Arquivo 1: `meu-bloco-dinamico.php`

```php
<?php
/**
 * Plugin Name: Meu Bloco Dinâmico
 * Description: Um bloco dinâmico que exibe os últimos posts
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Registra o bloco dinâmico
 */
function mbd_registrar_bloco() {
    // TODO 1: Use register_block_type() para registrar o bloco
    // - Primeiro parâmetro: caminho para a pasta build (__DIR__ . '/build')
    // - Segundo parâmetro: array com 'render_callback'
    // 
    // 📖 Docs: https://developer.wordpress.org/reference/functions/register_block_type/
    
}
add_action('init', 'mbd_registrar_bloco');

/**
 * Renderiza o bloco no frontend
 * 
 * @param array $attributes Os atributos do bloco
 * @return string HTML do bloco
 */
function mbd_renderizar_ultimos_posts($attributes) {
    // TODO 2: Extraia os atributos com valores padrão
    // - quantidade (padrão: 3)
    // - exibirData (padrão: true)  
    // - exibirExcerpt (padrão: true)
    //
    // 💡 Dica: Use isset() para verificar se o atributo existe
    
    $quantidade = ____;
    $exibir_data = ____;
    $exibir_excerpt = ____;

    // TODO 3: Busque os posts usando get_posts()
    // - numberposts: quantidade definida pelo usuário
    // - post_status: 'publish'
    //
    // 📖 Docs: https://developer.wordpress.org/reference/functions/get_posts/
    
    $posts = get_posts(array(
        ____ => ____,
        ____ => ____
    ));

    // Verifica se há posts
    if (empty($posts)) {
        return '<p>Nenhum post encontrado.</p>';
    }

    // Inicia o buffer de saída
    ob_start();
    ?>
    <div class="mbd-ultimos-posts">
        <h3>📰 Últimos Posts</h3>
        <ul class="mbd-lista">
            <?php foreach ($posts as $post) : ?>
                <li class="mbd-item">
                    <!-- TODO 4: Exiba o título como link -->
                    <!-- Use get_permalink() e esc_html() -->
                    <a href="____">
                        ____
                    </a>
                    
                    <!-- TODO 5: Exiba a data condicionalmente -->
                    <!-- Use get_the_date('d/m/Y', $post->ID) -->
                    <?php if (____) : ?>
                        <span class="mbd-data">
                            ____
                        </span>
                    <?php endif; ?>
                    
                    <!-- TODO 6: Exiba o excerpt condicionalmente -->
                    <!-- Use wp_trim_words() para limitar palavras -->
                    <?php if (____) : ?>
                        <p class="mbd-excerpt">
                            ____
                        </p>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php
    
    return ob_get_clean();
}
```

---

### Arquivo 2: `src/block.json`

```json
{
  "apiVersion": 3,
  "name": "meu-bloco/ultimos-posts",
  "title": "Últimos Posts",
  "category": "widgets",
  "icon": "list-view",
  "description": "Exibe os posts mais recentes do blog",
  "supports": {
    "html": false
  },
  "attributes": {
    
    // TODO 7: Defina os 3 atributos do bloco
    // 
    // quantidade:
    //   - type: "number"
    //   - default: 3
    //
    // exibirData:
    //   - type: ????
    //   - default: ????
    //
    // exibirExcerpt:
    //   - type: ????
    //   - default: ????
    //
    // 📖 Docs: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/
    
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

---

### Arquivo 3: `src/index.js`

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import './editor.scss';
import './style.scss';

registerBlockType('meu-bloco/ultimos-posts', {
    
    edit: function Edit({ attributes, setAttributes }) {
        // TODO 8: Extraia os atributos usando destructuring
        const { ____, ____, ____ } = attributes;
        
        const blockProps = useBlockProps();

        // TODO 9: Use o hook useSelect para buscar posts da REST API
        // 
        // 💡 Dica: select('core').getEntityRecords('postType', 'post', { ... })
        // 📖 Docs: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/
        
        const posts = useSelect((select) => {
            return select('core').getEntityRecords(____, ____, {
                per_page: ____,
                status: 'publish'
            });
        }, [____]); // Dependência: recarrega quando quantidade mudar

        return (
            <>
                {/* Painel de configurações na sidebar */}
                <InspectorControls>
                    <PanelBody title={__('Configurações', 'meu-bloco-dinamico')}>
                        
                        {/* TODO 10: Adicione RangeControl para quantidade */}
                        {/* Props: label, value, onChange, min, max */}
                        <RangeControl
                            ____
                        />
                        
                        {/* TODO 11: Adicione ToggleControl para exibirData */}
                        {/* Props: label, checked, onChange */}
                        <ToggleControl
                            ____
                        />
                        
                        {/* TODO 12: Adicione ToggleControl para exibirExcerpt */}
                        <ToggleControl
                            ____
                        />
                        
                    </PanelBody>
                </InspectorControls>

                {/* Preview do bloco no editor */}
                <div {...blockProps}>
                    <h3 className="mbd-titulo">📰 Últimos Posts</h3>
                    
                    {/* Loading state */}
                    {!posts && <Spinner />}
                    
                    {/* Empty state */}
                    {posts && posts.length === 0 && (
                        <p>Nenhum post encontrado.</p>
                    )}
                    
                    {/* Lista de posts */}
                    {posts && posts.length > 0 && (
                        <ul className="mbd-lista">
                            {posts.map((post) => (
                                <li key={post.id} className="mbd-item">
                                    
                                    {/* TODO 13: Exiba o título do post */}
                                    {/* Use post.title.rendered */}
                                    <a href="#" className="mbd-link">
                                        ____
                                    </a>
                                    
                                    {/* TODO 14: Exiba a data condicionalmente */}
                                    {/* Converta post.date para formato BR */}
                                    {____ && (
                                        <span className="mbd-data">
                                            {new Date(____).toLocaleDateString('pt-BR')}
                                        </span>
                                    )}
                                    
                                    {/* TODO 15: Exiba o excerpt condicionalmente */}
                                    {____ && post.excerpt && (
                                        <p 
                                            className="mbd-excerpt"
                                            dangerouslySetInnerHTML={{ 
                                                __html: post.excerpt.rendered.slice(0, 100) + '...' 
                                            }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </>
        );
    },

    // TODO 16: O que blocos dinâmicos retornam no save()?
    // 💡 Dica: O conteúdo é gerado pelo PHP, não precisa salvar HTML
    save: function Save() {
        return ____;
    }
});
```

---

### Arquivo 4: `src/style.scss`

```scss
// TODO 17: Estilize o bloco
// Esse CSS será aplicado no frontend E no editor
// 
// Dicas:
// - Use .mbd-ultimos-posts como container principal
// - Estilize .mbd-lista, .mbd-item, .mbd-link, .mbd-data, .mbd-excerpt
// - Adicione hover effects para melhor UX
// - Considere usar flexbox ou grid

.mbd-ultimos-posts {
    // Seu CSS aqui
}
```

---

## ✅ Checklist de Validação

Teste seu bloco verificando cada item:

- [ ] O plugin aparece na lista de plugins do WordPress
- [ ] O bloco aparece no inserter do editor (busque por "Últimos Posts")
- [ ] O slider de quantidade funciona (1-10)
- [ ] Os toggles de data e excerpt funcionam
- [ ] O preview mostra posts reais no editor
- [ ] O frontend exibe os posts corretamente
- [ ] Mudar configurações atualiza o frontend

---

## 📖 Recursos para Pesquisa

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [register_block_type()](https://developer.wordpress.org/reference/functions/register_block_type/)
- [get_posts()](https://developer.wordpress.org/reference/functions/get_posts/)
- [useSelect Hook](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/)
- [InspectorControls](https://developer.wordpress.org/block-editor/reference-guides/components/inspector-controls/)

---

## 🚀 Desafios Bônus (após completar)

1. **Fácil:** Adicione um atributo para filtrar por categoria
2. **Médio:** Adicione imagem destacada aos posts
3. **Avançado:** Crie um layout alternativo em grid com toggle

---

**Boa sorte! 🎉**
