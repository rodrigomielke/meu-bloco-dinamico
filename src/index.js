// Função utilitária para montar a imagem destacada
function PostImage({ post, grid }) {
    if (!post._embedded || !post._embedded['wp:featuredmedia']) return null;
    const src = post._embedded['wp:featuredmedia'][0].source_url;
    const className = grid ? 'mbd-thumb mbd-thumb-center' : 'mbd-thumb';
    const style = grid
        ? { maxWidth: 80, borderRadius: 6, margin: '10px auto', objectFit: 'cover', display: 'block' }
        : { maxWidth: 80, borderRadius: 6, marginRight: 10, objectFit: 'cover' };
    return <img className={className} src={src} alt={post.title.rendered} style={style} />;
}

// Função utilitária para renderizar o resumo
function PostExcerpt({ post, grid }) {
    if (!post.excerpt) return null;
    const style = grid
        ? { width: '100%', marginBottom: 0, marginTop: 8 }
        : { flex: 1, marginBottom: 0 };
    return (
        <p
            className="mbd-excerpt"
            style={style}
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.slice(0, 100) + '...' }}
        />
    );
}

// Função utilitária para renderizar a data
function PostDate({ post, grid }) {
    if (!post.date) return null;
    if (grid) {
        return (
            <div style={{ width: '100%', textAlign: 'center', marginTop: 6 }}>
                <span className="mbd-data">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                </span>
            </div>
        );
    }
    return (
        <span className="mbd-data" style={{ marginLeft: 12, whiteSpace: 'nowrap' }}>
            {new Date(post.date).toLocaleDateString('pt-BR')}
        </span>
    );
}
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Spinner, SelectControl } from '@wordpress/components';
import { ColorPalette } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import './editor.scss';
import './style.scss';

registerBlockType('meu-bloco/ultimos-posts', {
    
    edit: function Edit({ attributes, setAttributes }) {
        const { quantidade, exibirData, exibirExcerpt, categoriaId, exibirImagem, layoutGrid, backgroundColor, cardBackgroundColor, titleColor, excerptColor, dateColor } = attributes;
        
        const blockProps = useBlockProps();


        // Buscar categorias
        const categorias = useSelect((select) => {
            return select('core').getEntityRecords('taxonomy', 'category', { per_page: 100 });
        }, []);

        // Buscar posts filtrando por categoria
        const posts = useSelect((select) => {
            const query = {
                per_page: quantidade,
                status: 'publish',
                _embed: true
            };
            if (categoriaId && categoriaId !== 0) {
                query.categories = categoriaId;
            }
            return select('core').getEntityRecords('postType', 'post', query);
        }, [quantidade, categoriaId]);

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Configurações', 'meu-bloco-dinamico')}>
                        <PanelBody title={__('Cores do Bloco', 'meu-bloco-dinamico')} initialOpen={false}>
                            <p><strong>Cor de fundo do bloco</strong></p>
                            <ColorPalette
                                value={backgroundColor}
                                onChange={color => setAttributes({ backgroundColor: color })}
                            />
                            <p style={{ marginTop: 12 }}><strong>Cor de fundo dos cards</strong></p>
                            <ColorPalette
                                value={cardBackgroundColor}
                                onChange={color => setAttributes({ cardBackgroundColor: color })}
                            />
                            <p style={{ marginTop: 12 }}><strong>Cor do título</strong></p>
                            <ColorPalette
                                value={titleColor}
                                onChange={color => setAttributes({ titleColor: color })}
                            />
                            <p style={{ marginTop: 12 }}><strong>Cor do resumo</strong></p>
                            <ColorPalette
                                value={excerptColor}
                                onChange={color => setAttributes({ excerptColor: color })}
                            />
                            <p style={{ marginTop: 12 }}><strong>Cor da data</strong></p>
                            <ColorPalette
                                value={dateColor}
                                onChange={color => setAttributes({ dateColor: color })}
                            />
                        </PanelBody>
                        <RangeControl
                            label={__('Quantidade de Posts', 'meu-bloco-dinamico')}
                            value={quantidade}
                            onChange={(value) => setAttributes({ quantidade: value })}
                            min={1}
                            max={10}
                        />
                        <ToggleControl
                            label={__('Exibir Data', 'meu-bloco-dinamico')}
                            checked={exibirData}
                            onChange={(value) => setAttributes({ exibirData: value })}
                        />
                        <ToggleControl
                            label={__('Exibir Resumo', 'meu-bloco-dinamico')}
                            checked={exibirExcerpt}
                            onChange={(value) => setAttributes({ exibirExcerpt: value })}
                        />
                        <ToggleControl
                            label={__('Exibir Imagem', 'meu-bloco-dinamico')}
                            checked={exibirImagem}
                            onChange={(value) => setAttributes({ exibirImagem: value })}
                        />
                        <ToggleControl
                            label={__('Layout em Grid', 'meu-bloco-dinamico')}
                            checked={layoutGrid}
                            onChange={(value) => setAttributes({ layoutGrid: value })}
                        />
                        <SelectControl
                            label={__('Categoria', 'meu-bloco-dinamico')}
                            value={categoriaId}
                            options={[
                                { label: __('Todas as categorias', 'meu-bloco-dinamico'), value: 0 },
                                ...(categorias ? categorias.map(cat => ({ label: cat.name, value: cat.id })) : [])
                            ]}
                            onChange={(value) => setAttributes({ categoriaId: Number(value) })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <h3 className="mbd-titulo" style={{ color: titleColor }}>📰 Últimos Posts</h3>
                    <div style={{ background: backgroundColor, borderRadius: 12, padding: 4 }}>
                        {!posts && <Spinner />}
                        {posts && posts.length === 0 && <p>Nenhum post encontrado.</p>}
                        {posts && posts.length > 0 && (
                            <ul className={layoutGrid ? 'mbd-lista mbd-grid' : 'mbd-lista'}>
                                {posts.map((post, idx) => (
                                    <li
                                        key={post.id}
                                        className={layoutGrid ? 'mbd-item mbd-grid-item' : 'mbd-item'}
                                        style={{
                                            background: cardBackgroundColor,
                                            ...(layoutGrid ? {} : { display: 'flex', alignItems: 'flex-start', gap: 12 })
                                        }}
                                    >
                                        <span
                                            className="mbd-numero"
                                            style={{
                                                display: 'inline-block',
                                                minWidth: 24,
                                                textAlign: 'right',
                                                marginRight: 10,
                                                color: titleColor,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {idx + 1}.
                                        </span>
                                        {!layoutGrid && exibirImagem && <PostImage post={post} grid={false} />}
                                        <div className="mbd-conteudo" style={{ width: '100%' }}>
                                            <a href={post.link} className="mbd-link" style={{ color: titleColor }}>
                                                {post.title.rendered}
                                            </a>
                                            {layoutGrid && exibirImagem && <PostImage post={post} grid={true} />}
                                            {layoutGrid ? (
                                                <>
                                                    {exibirExcerpt && <PostExcerpt post={post} grid={layoutGrid} style={{ color: excerptColor }} />}
                                                    {exibirData && <PostDate post={post} grid={layoutGrid} style={{ color: dateColor }} />}
                                                </>
                                            ) : (
                                                (exibirExcerpt || exibirData) && (
                                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                        {exibirExcerpt && <PostExcerpt post={post} grid={false} style={{ color: excerptColor }} />}
                                                        {exibirData && <PostDate post={post} grid={false} style={{ color: dateColor }} />}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </>
        );
    },

    save: function Save() {
        return null;
    }
});