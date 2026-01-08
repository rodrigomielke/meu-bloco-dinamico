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
    register_block_type(__DIR__ . '/build', array(
        'render_callback' => 'mbd_renderizar_ultimos_posts',
    ));
}
add_action('init', 'mbd_registrar_bloco');

/**
 * Renderiza o bloco no frontend
 * 
 * @param array $attributes Os atributos do bloco
 * @return string HTML do bloco
 */
function mbd_renderizar_ultimos_posts($attributes) {
    $cardBackgroundColor = isset($attributes['cardBackgroundColor']) ? $attributes['cardBackgroundColor'] : '#fff';
    $backgroundColor = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '#f8fafc';
    $titleColor = isset($attributes['titleColor']) ? $attributes['titleColor'] : '#2563eb';
    $excerptColor = isset($attributes['excerptColor']) ? $attributes['excerptColor'] : '#334155';
    $dateColor = isset($attributes['dateColor']) ? $attributes['dateColor'] : '#64748b';
    $numeroColor = $titleColor;
        // Função inline para imagem destacada ou primeira imagem do conteúdo
        $get_img = function($post, $class, $style) {
            if (has_post_thumbnail($post->ID)) {
                return get_the_post_thumbnail($post->ID, 'thumbnail', array('class' => $class, 'style' => $style));
            } elseif (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $post->post_content, $matches)) {
                return '<img class="' . esc_attr($class) . '" src="' . esc_url($matches[1]) . '" style="' . esc_attr($style) . '" />';
            }
            return '';
        };
        // Função inline para excerpt
        $get_excerpt = function($post, $words = 20) {
            $excerpt = $post->post_excerpt;
            if (empty($excerpt)) {
                $excerpt = wp_trim_words(strip_tags($post->post_content), $words);
            }
            return esc_html($excerpt);
        };
    $quantidade = isset($attributes['quantidade']) ? $attributes['quantidade'] : 3;
    $exibir_data = isset($attributes['exibirData']) ? $attributes['exibirData'] : true;  
    $exibir_excerpt = isset($attributes['exibirExcerpt']) ? $attributes['exibirExcerpt'] : true;
    $categoria_id = isset($attributes['categoriaId']) ? intval($attributes['categoriaId']) : 0;
    $exibir_imagem = isset($attributes['exibirImagem']) ? $attributes['exibirImagem'] : true;
    $layout_grid = isset($attributes['layoutGrid']) ? $attributes['layoutGrid'] : false;

    $args = array(
        'posts_per_page' => $quantidade,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
    );
    if ($categoria_id && $categoria_id !== 0) {
        $args['category__in'] = array($categoria_id);
    }
    $query = new WP_Query($args);
    $posts = $query->posts;

    if (empty($posts)) {
        return '<p>Nenhum post encontrado.</p>';
    }

    ob_start();
    ?>
    <div class="mbd-ultimos-posts" style="background:<?php echo esc_attr($backgroundColor); ?>;border-radius:12px;padding:4px;">
        <h3 style="color:<?php echo esc_attr($titleColor); ?>;">📰 Últimos Posts</h3>
        <ul class="mbd-lista<?php echo $layout_grid ? ' mbd-grid' : ''; ?>">
            <?php foreach ($posts as $idx => $post) : ?>
                <li class="mbd-item<?php echo $layout_grid ? ' mbd-grid-item' : ''; ?>" style="background:<?php echo esc_attr($cardBackgroundColor); ?>;<?php if (!$layout_grid) echo 'display:flex;align-items:flex-start;gap:12px;'; ?>">
                    <span class="mbd-numero" style="display:inline-block;min-width:24px;text-align:right;margin-right:10px;color:<?php echo esc_attr($numeroColor); ?>;font-weight:700;">
                        <?php echo ($idx + 1) . '.'; ?>
                    </span>
                    <?php if (!$layout_grid && $exibir_imagem) : ?>
                        <div style="display:flex;align-items:flex-start;">
                            <?php echo $get_img($post, 'mbd-thumb', 'max-width:80px;border-radius:6px;margin-right:10px;object-fit:cover;'); ?>
                        </div>
                    <?php endif; ?>
                    <div style="flex:1;">
                        <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" class="mbd-link" style="color:<?php echo esc_attr($titleColor); ?>;">
                            <?php echo esc_html($post->post_title); ?>
                        </a>
                        <?php if ($layout_grid && $exibir_imagem) : ?>
                            <div style="width:100%;text-align:center;">
                                <?php echo $get_img($post, 'mbd-thumb mbd-thumb-center', 'max-width:80px;border-radius:6px;margin:10px auto;object-fit:cover;display:block;'); ?>
                            </div>
                        <?php endif; ?>
                        <?php if ($layout_grid) : ?>
                            <?php if ($exibir_excerpt) : ?>
                                <p class="mbd-excerpt" style="width:100%;margin-bottom:0;margin-top:8px;color:<?php echo esc_attr($excerptColor); ?>;">
                                    <?php echo $get_excerpt($post, 20); ?>
                                </p>
                            <?php endif; ?>
                            <?php if ($exibir_data) : ?>
                                <div style="width:100%;text-align:center;margin-top:6px;">
                                    <span class="mbd-data" style="color:<?php echo esc_attr($dateColor); ?>;">
                                        <?php echo get_the_date('d/m/Y', $post->ID); ?>
                                    </span>
                                </div>
                            <?php endif; ?>
                        <?php else : ?>
                            <?php if ($exibir_data || $exibir_excerpt) : ?>
                                <div style="display:flex;align-items:center;width:100%;">
                                    <?php if ($exibir_excerpt) : ?>
                                        <p class="mbd-excerpt" style="flex:1;margin-bottom:0;color:<?php echo esc_attr($excerptColor); ?>;">
                                            <?php echo $get_excerpt($post, 20); ?>
                                        </p>
                                    <?php endif; ?>
                                    <?php if ($exibir_data) : ?>
                                        <span class="mbd-data" style="margin-left:12px;white-space:nowrap;color:<?php echo esc_attr($dateColor); ?>;">
                                            <?php echo get_the_date('d/m/Y', $post->ID); ?>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php
    
    return ob_get_clean();
}
?>