<?php
// Включаем общий заголовок сайта
include 'header.php';

// Получаем язык из параметра URL или устанавливаем русский по умолчанию
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'ru';

// Массивы с текстами на разных языках
$texts = [
    'ru' => [
        'title' => 'Проект молекулярной анимации',
        'subtitle' => 'Создание интерактивных визуализаций молекулярных структур',
        'description' => 'Наш проект молекулярной анимации позволяет создавать высококачественные 2D и 3D визуализации химических соединений для образовательных и исследовательских целей.',
        'features_title' => 'Возможности',
        'feature1_title' => '2D анимации',
        'feature1_desc' => 'Создание двумерных анимаций молекулярных структур с использованием RDKit и matplotlib',
        'feature2_title' => '3D визуализация',
        'feature2_desc' => 'Интерактивные трехмерные модели молекул с помощью PyMOL и 3Dmol.js',
        'feature3_title' => 'Веб-интерфейс',
        'feature3_desc' => 'Доступ к функциям проекта через удобный веб-интерфейс',
        'feature4_title' => 'Экспорт видео',
        'feature4_desc' => 'Сохранение анимаций в популярных видеоформатах',
        'how_it_works' => 'Как это работает',
        'step1' => 'Загрузите структуру молекулы в формате SMILES, MOL или PDB',
        'step2' => 'Выберите тип визуализации (2D или 3D)',
        'step3' => 'Настройте параметры анимации',
        'step4' => 'Просмотрите результат в браузере или экспортируйте в видеофайл',
        'tech_title' => 'Технологии',
        'contact_title' => 'Свяжитесь с нами',
        'contact_text' => 'Заинтересованы в использовании нашего проекта молекулярной анимации? Свяжитесь с нами для получения дополнительной информации.',
        'contact_button' => 'Отправить сообщение',
        'back_to_meded' => 'Вернуться к МедОбр'
    ],
    'en' => [
        'title' => 'Molecular Animation Project',
        'subtitle' => 'Creating interactive visualizations of molecular structures',
        'description' => 'Our molecular animation project allows you to create high-quality 2D and 3D visualizations of chemical compounds for educational and research purposes.',
        'features_title' => 'Features',
        'feature1_title' => '2D Animations',
        'feature1_desc' => 'Create two-dimensional animations of molecular structures using RDKit and matplotlib',
        'feature2_title' => '3D Visualization',
        'feature2_desc' => 'Interactive three-dimensional models of molecules using PyMOL and 3Dmol.js',
        'feature3_title' => 'Web Interface',
        'feature3_desc' => 'Access project functions through a convenient web interface',
        'feature4_title' => 'Video Export',
        'feature4_desc' => 'Save animations in popular video formats',
        'how_it_works' => 'How It Works',
        'step1' => 'Upload a molecule structure in SMILES, MOL, or PDB format',
        'step2' => 'Choose visualization type (2D or 3D)',
        'step3' => 'Configure animation parameters',
        'step4' => 'View the result in your browser or export to a video file',
        'tech_title' => 'Technologies',
        'contact_title' => 'Contact Us',
        'contact_text' => 'Interested in using our molecular animation project? Contact us for more information.',
        'contact_button' => 'Send Message',
        'back_to_meded' => 'Back to MedEd'
    ]
];

// Выбираем нужный язык
$t = isset($texts[$lang]) ? $texts[$lang] : $texts['ru'];
?>

<!-- CSS для страницы молекулярной анимации -->
<style>
    .molecular-hero {
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('images/molecular-bg.jpg');
        background-size: cover;
        background-position: center;
        color: white;
        padding: 100px 0;
        text-align: center;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin: 50px 0;
    }

    .feature-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-5px);
    }

    .feature-icon {
        font-size: 2.5rem;
        color: #1e88e5;
        margin-bottom: 15px;
    }

    .steps {
        counter-reset: step-counter;
        margin: 40px 0;
    }

    .step {
        display: flex;
        margin-bottom: 30px;
        position: relative;
    }

    .step-number {
        counter-increment: step-counter;
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background: #1e88e5;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 20px;
    }

    .step-number:before {
        content: counter(step-counter);
    }

    .tech-logos {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 40px;
        margin: 40px 0;
    }

    .tech-logo {
        text-align: center;
        width: 100px;
    }

    .tech-logo img {
        max-width: 100%;
        height: 60px;
        object-fit: contain;
    }

    .tech-logo p {
        margin-top: 10px;
        font-size: 14px;
    }

    .contact-section {
        background: #f0f4f8;
        padding: 60px 0;
        text-align: center;
        margin-top: 60px;
    }

    .back-button {
        margin-top: 30px;
    }
</style>

<!-- Главный баннер -->
<section class="molecular-hero">
    <div class="container">
        <h1><?php echo $t['title']; ?></h1>
        <p class="lead"><?php echo $t['subtitle']; ?></p>
    </div>
</section>

<!-- Описание проекта -->
<section class="container my-5">
    <div class="row">
        <div class="col-md-8 offset-md-2 text-center">
            <p class="lead"><?php echo $t['description']; ?></p>
        </div>
    </div>
</section>

<!-- Возможности -->
<section class="container my-5">
    <h2 class="text-center mb-4"><?php echo $t['features_title']; ?></h2>
    <div class="features-grid">
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-chart-line"></i>
            </div>
            <h3><?php echo $t['feature1_title']; ?></h3>
            <p><?php echo $t['feature1_desc']; ?></p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-cube"></i>
            </div>
            <h3><?php echo $t['feature2_title']; ?></h3>
            <p><?php echo $t['feature2_desc']; ?></p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-globe"></i>
            </div>
            <h3><?php echo $t['feature3_title']; ?></h3>
            <p><?php echo $t['feature3_desc']; ?></p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">
                <i class="fas fa-video"></i>
            </div>
            <h3><?php echo $t['feature4_title']; ?></h3>
            <p><?php echo $t['feature4_desc']; ?></p>
        </div>
    </div>
</section>

<!-- Как это работает -->
<section class="container my-5">
    <h2 class="text-center mb-4"><?php echo $t['how_it_works']; ?></h2>
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="steps">
                <div class="step">
                    <div class="step-number"></div>
                    <div class="step-content">
                        <p><?php echo $t['step1']; ?></p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number"></div>
                    <div class="step-content">
                        <p><?php echo $t['step2']; ?></p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number"></div>
                    <div class="step-content">
                        <p><?php echo $t['step3']; ?></p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number"></div>
                    <div class="step-content">
                        <p><?php echo $t['step4']; ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Демонстрация -->
<section class="container my-5 text-center">
    <h2 class="mb-4">Демонстрация</h2>
    <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" allowfullscreen></iframe>
    </div>
</section>

<!-- Технологии -->
<section class="container my-5">
    <h2 class="text-center mb-4"><?php echo $t['tech_title']; ?></h2>
    <div class="tech-logos">
        <div class="tech-logo">
            <img src="images/python-logo.png" alt="Python">
            <p>Python</p>
        </div>
        <div class="tech-logo">
            <img src="images/rdkit-logo.png" alt="RDKit">
            <p>RDKit</p>
        </div>
        <div class="tech-logo">
            <img src="images/pymol-logo.png" alt="PyMOL">
            <p>PyMOL</p>
        </div>
        <div class="tech-logo">
            <img src="images/flask-logo.png" alt="Flask">
            <p>Flask</p>
        </div>
        <div class="tech-logo">
            <img src="images/3dmol-logo.png" alt="3Dmol.js">
            <p>3Dmol.js</p>
        </div>
    </div>
</section>

<!-- Контакты -->
<section class="contact-section">
    <div class="container">
        <h2 class="mb-4"><?php echo $t['contact_title']; ?></h2>
        <p class="lead mb-4"><?php echo $t['contact_text']; ?></p>
        <a href="#contact-form" class="btn btn-primary"><?php echo $t['contact_button']; ?></a>
        <div class="back-button">
            <a href="med_ed.php?lang=<?php echo $lang; ?>" class="btn btn-outline-primary">
                <i class="fas fa-arrow-left"></i> <?php echo $t['back_to_meded']; ?>
            </a>
        </div>
    </div>
</section>

<?php
// Включаем общий футер сайта
include 'footer.php';
?>
