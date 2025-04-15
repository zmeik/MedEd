// Глобальные переменные
let viewer; // 3Dmol.js viewer
let gif; // Для создания GIF анимаций
let currentMolecule = 'h2o'; // Молекула по умолчанию
let isRotating = false;
let animationSpeed = 5;
let currentStyle = 'ballAndStick';
let useGradientBackground = false;
let rotationIntervalId;

// Основные молекулярные данные (упрощенные для примера)
const MOLECULES = {
    'h2o': {
        name: 'Вода',
        formula: 'H2O',
        weight: '18.01528 г/моль',
        type: 'Полярная',
        atoms: [
            {element: 'O', coordinates: [0, 0, 0], color: '#FF0000'},
            {element: 'H', coordinates: [0.757, 0.586, 0], color: '#FFFFFF'},
            {element: 'H', coordinates: [-0.757, 0.586, 0], color: '#FFFFFF'}
        ],
        bonds: [
            {atoms: [0, 1], order: 1, length: '0.96 Å'},
            {atoms: [0, 2], order: 1, length: '0.96 Å'}
        ],
        angles: {'H-O-H': '104.5°'},
        pdb: `HEADER    WATER\nCOMPND    H2O\nATOM      1  O   HOH     1       0.000   0.000   0.000\nATOM      2  H   HOH     1       0.757   0.586   0.000\nATOM      3  H   HOH     1      -0.757   0.586   0.000\nEND`
    },
    'co2': {
        name: 'Углекислый газ',
        formula: 'CO2',
        weight: '44.01 г/моль',
        type: 'Неполярная',
        atoms: [
            {element: 'C', coordinates: [0, 0, 0], color: '#808080'},
            {element: 'O', coordinates: [1.16, 0, 0], color: '#FF0000'},
            {element: 'O', coordinates: [-1.16, 0, 0], color: '#FF0000'}
        ],
        bonds: [
            {atoms: [0, 1], order: 2, length: '1.16 Å'},
            {atoms: [0, 2], order: 2, length: '1.16 Å'}
        ],
        angles: {'O-C-O': '180°'},
        pdb: `HEADER    CARBON DIOXIDE\nCOMPND    CO2\nATOM      1  C   CO2     1       0.000   0.000   0.000\nATOM      2  O   CO2     1       1.160   0.000   0.000\nATOM      3  O   CO2     1      -1.160   0.000   0.000\nEND`
    },
    'ch4': {
        name: 'Метан',
        formula: 'CH4',
        weight: '16.04 г/моль',
        type: 'Неполярная',
        atoms: [
            {element: 'C', coordinates: [0, 0, 0], color: '#808080'},
            {element: 'H', coordinates: [0.626, 0.626, 0.626], color: '#FFFFFF'},
            {element: 'H', coordinates: [-0.626, -0.626, 0.626], color: '#FFFFFF'},
            {element: 'H', coordinates: [0.626, -0.626, -0.626], color: '#FFFFFF'},
            {element: 'H', coordinates: [-0.626, 0.626, -0.626], color: '#FFFFFF'}
        ],
        bonds: [
            {atoms: [0, 1], order: 1, length: '1.09 Å'},
            {atoms: [0, 2], order: 1, length: '1.09 Å'},
            {atoms: [0, 3], order: 1, length: '1.09 Å'},
            {atoms: [0, 4], order: 1, length: '1.09 Å'}
        ],
        angles: {'H-C-H': '109.5°'},
        pdb: `HEADER    METHANE\nCOMPND    CH4\nATOM      1  C   CH4     1       0.000   0.000   0.000\nATOM      2  H   CH4     1       0.626   0.626   0.626\nATOM      3  H   CH4     1      -0.626  -0.626   0.626\nATOM      4  H   CH4     1       0.626  -0.626  -0.626\nATOM      5  H   CH4     1      -0.626   0.626  -0.626\nEND`
    },
    'c6h6': {
        name: 'Бензол',
        formula: 'C6H6',
        weight: '78.11 г/моль',
        type: 'Неполярная, ароматическая',
        pdb: `HEADER    BENZENE\nCOMPND    C6H6\nATOM      1  C   BNZ     1       0.000   1.396   0.000\nATOM      2  C   BNZ     1       1.209   0.698   0.000\nATOM      3  C   BNZ     1       1.209  -0.698   0.000\nATOM      4  C   BNZ     1       0.000  -1.396   0.000\nATOM      5  C   BNZ     1      -1.209  -0.698   0.000\nATOM      6  C   BNZ     1      -1.209   0.698   0.000\nATOM      7  H   BNZ     1       0.000   2.479   0.000\nATOM      8  H   BNZ     1       2.147   1.240   0.000\nATOM      9  H   BNZ     1       2.147  -1.240   0.000\nATOM     10  H   BNZ     1       0.000  -2.479   0.000\nATOM     11  H   BNZ     1      -2.147  -1.240   0.000\nATOM     12  H   BNZ     1      -2.147   1.240   0.000\nEND`
    },
    // Добавьте больше молекул по мере необходимости
};

// Инициализация молекулярного просмотра
function initializeMolecule() {
    // Создаем 3Dmol.js viewer
    const element = document.getElementById('mol3d-container');
    viewer = $3Dmol.createViewer(element, {
        backgroundColor: 'white',
        antialias: true,
        id: 'viewer'
    });

    // Загружаем молекулу по умолчанию
    loadMolecule(currentMolecule);

    // Заполняем информационную панель
    updateMoleculeInfo(currentMolecule);

    // Инициализируем график энергии
    initEnergyChart();
}

// Загрузка молекулы в просмотрщик
function loadMolecule(moleculeId) {
    if (!MOLECULES[moleculeId]) {
        console.error(`Молекула с ID ${moleculeId} не найдена`);
        return;
    }

    // Очищаем текущую молекулу
    viewer.clear();

    // Устанавливаем новую текущую молекулу
    currentMolecule = moleculeId;

    // Получаем PDB данные
    const molecule = MOLECULES[moleculeId];
    const pdbData = molecule.pdb;

    // Загружаем молекулу из PDB строки
    const format = pdbData.startsWith('HEADER') ? 'pdb' : 'xyz';
    viewer.addModel(pdbData, format, {keepH: true});

    // Применяем стиль визуализации
    applyMoleculeStyle();

    // Добавляем дополнительные опции отображения
    applyVisualizationOptions();

    // Обновляем информацию о молекуле на странице
    updateMoleculeInfo(moleculeId);

    // Зумируем молекулу так, чтобы она полностью помещалась в окне просмотра
    viewer.zoomTo();

    // Отрисовываем молекулу
    viewer.render();

    // Обновляем отладочную информацию
    updateDebugInfo(`Молекула ${MOLECULES[moleculeId].name} загружена успешно`);
}

// Применение стиля визуализации
function applyMoleculeStyle() {
    // Получаем выбранный стиль
    const style = document.getElementById('molecule-style').value;
    currentStyle = style;

    // Получаем размеры атомов и связей
    const atomSize = parseFloat(document.getElementById('atom-size').value);
    const bondSize = parseFloat(document.getElementById('bond-size').value);

    // Получаем цветовую схему
    const coloringScheme = document.getElementById('coloring-scheme').value;

    // Базовые настройки стиля
    const styleOptions = {
        sphere: { radius: atomSize },
        stick: { radius: bondSize },
        line: { linewidth: bondSize * 3 },
        cartoon: { color: 'spectrum' },
        wireframe: { linewidth: bondSize * 2 }
    };

    // Применяем стиль к молекуле
    switch (style) {
        case 'ballAndStick':
            viewer.setStyle({}, {stick: styleOptions.stick, sphere: styleOptions.sphere});
            break;
        case 'spaceFill':
            viewer.setStyle({}, {sphere: { scale: 1.0 }});
            break;
        case 'wireframe':
            viewer.setStyle({}, {line: styleOptions.line});
            break;
        case 'cartoon':
            // Cartoon больше подходит для белков
            viewer.setStyle({}, {cartoon: styleOptions.cartoon});
            break;
        case 'line':
            viewer.setStyle({}, {line: styleOptions.line});
            break;
        case 'surface':
            // Сначала установим базовый стиль
            viewer.setStyle({}, {stick: styleOptions.stick});

            // Затем добавим поверхность
            const surfaceOptions = {
                opacity: 0.7,
                colorscheme: coloringScheme === 'element' ? 'whiteCarbon' : coloringScheme
            };
            viewer.addSurface($3Dmol.SurfaceType.VDW, surfaceOptions);
            break;
        case 'toon':
            // Мультипликационный стиль (комбинация поверхности и упрощенной геометрии)
            viewer.setStyle({}, {cartoon: {color: 'spectrum', thickness: 0.4, opacity: 0.9}});
            break;
        case 'ribbon':
            // Ленточная диаграмма для белков
            viewer.setStyle({}, {cartoon: {style: 'ribbon', color: 'spectrum', thickness: 0.4}});
            break;
    }

    // Применение цветовой схемы
    applyColoringScheme(coloringScheme);
}

// Применение цветовой схемы
function applyColoringScheme(scheme) {
    switch (scheme) {
        case 'element':
            // Стандартные цвета по элементам
            break;
        case 'residue':
            // Цвета по остаткам (для белков)
            viewer.setStyle({}, {cartoon: {colorfunc: color_by_residue}});
            break;
        case 'chain':
            // Цвета по цепям (для белков)
            viewer.setStyle({}, {cartoon: {colorfunc: color_by_chain}});
            break;
        case 'spectrum':
            // Спектральные цвета
            viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
            break;
        case 'hydrophobicity':
            // Цвета по гидрофобности (для белков)
            viewer.setStyle({}, {cartoon: {colorfunc: color_by_hydrophobicity}});
            break;
        case 'temperature':
            // Цвета по B-фактору (для белков)
            viewer.setStyle({}, {cartoon: {colorfunc: color_by_temperature}});
            break;
    }
}

// Функция для раскраски по остаткам
function color_by_residue(atom) {
    // Упрощенная функция для примера
    const residueMap = {
        'ALA': '#C8C8C8',
        'ARG': '#145AFF',
        'ASN': '#00DCDC',
        'ASP': '#E60A0A',
        'CYS': '#E6E600',
        // ... добавьте другие остатки
    };

    if (atom.resn && residueMap[atom.resn]) {
        return residueMap[atom.resn];
    }
    return '#CCCCCC'; // Цвет по умолчанию
}

// Функция для раскраски по цепям
function color_by_chain(atom) {
    const chains = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    const chainIndex = atom.chain ? atom.chain.charCodeAt(0) - 65 : 0;
    return chains[chainIndex % chains.length];
}

// Функция для раскраски по гидрофобности
function color_by_hydrophobicity(atom) {
    const hydrophobicity = {
        'ILE': 4.5, 'VAL': 4.2, 'LEU': 3.8, 'PHE': 2.8, 'CYS': 2.5, 'MET': 1.9, 'ALA': 1.8,
        'GLY': -0.4, 'THR': -0.7, 'SER': -0.8, 'TRP': -0.9, 'TYR': -1.3, 'PRO': -1.6,
        'HIS': -3.2, 'GLU': -3.5, 'GLN': -3.5, 'ASP': -3.5, 'ASN': -3.5, 'LYS': -3.9, 'ARG': -4.5
    };

    if (atom.resn && hydrophobicity[atom.resn]) {
        // Преобразуем шкалу гидрофобности в цвет от синего (гидрофильный) до красного (гидрофобный)
        const h = hydrophobicity[atom.resn];
        const normalizedValue = (h + 4.5) / 9.0;  // Нормализуем от 0 до 1

        // Создаем цвет: синий -> белый -> красный
        if (normalizedValue < 0.5) {
            // От синего до белого
            const value = Math.floor(normalizedValue * 2 * 255);
            return `rgb(${value}, ${value}, 255)`;
        } else {
            // От белого до красного
            const value = Math.floor((1 - (normalizedValue - 0.5) * 2) * 255);
            return `rgb(255, ${value}, ${value})`;
        }
    }
    return '#CCCCCC'; // Цвет по умолчанию
}

// Функция для раскраски по температурному фактору
function color_by_temperature(atom) {
    if (atom.b !== undefined) {
        // Предполагаем, что B-фактор в диапазоне от 0 до 100
        const normalizedValue = Math.min(1.0, atom.b / 100.0);

        // Создаем цвет: синий (холодный) -> белый -> красный (горячий)
        if (normalizedValue < 0.5) {
            // От синего до белого
            const value = Math.floor(normalizedValue * 2 * 255);
            return `rgb(${value}, ${value}, 255)`;
        } else {
            // От белого до красного
            const value = Math.floor((1 - (normalizedValue - 0.5) * 2) * 255);
            return `rgb(255, ${value}, ${value})`;
        }
    }
    return '#CCCCCC'; // Цвет по умолчанию
}

// Применение дополнительных опций визуализации
function applyVisualizationOptions() {
    // Показать/скрыть подписи атомов
    const showAtomLabels = document.getElementById('show-atoms-labels').checked;
    if (showAtomLabels) {
        viewer.addLabel('*', {fontSize: 12, showBackground: true});
    }

    // Показать/скрыть подписи связей
    const showBondLabels = document.getElementById('show-bonds-labels').checked;
    if (showBondLabels) {
        // Здесь должна быть реализация для подписей связей
        // В 3Dmol.js нет прямого способа добавить метки к связям, это нужно реализовать отдельно
    }

    // Показать/скрыть электронную плотность
    const showElectronDensity = document.getElementById('show-electron-density').checked;
    if (showElectronDensity) {
        // Это сложная визуализация, требующая данных о плотности
        // Для примера добавим упрощенную визуализацию электронной плотности
        addSimpleElectronDensity();
    }

    // Показать/скрыть измерения
    const showMeasurements = document.getElementById('show-measurements').checked;
    if (showMeasurements) {
        addMeasurements();
    }
}

// Упрощенная визуализация электронной плотности
function addSimpleElectronDensity() {
    // В реальных приложениях электронная плотность обычно загружается из файлов данных
    // Здесь мы создаем упрощенное представление, добавляя полупрозрачную сферу вокруг атомов
    viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.3,
        colorscheme: 'whiteCarbon'
    });
}

// Добавление измерений (расстояния между атомами)
function addMeasurements() {
    // Получаем текущую молекулу
    const molecule = MOLECULES[currentMolecule];

    // Если есть информация о связях, добавляем измерения расстояний
    if (molecule.bonds && molecule.bonds.length > 0) {
        molecule.bonds.forEach((bond, index) => {
            // Получаем индексы атомов в связи
            const atom1Index = bond.atoms[0];
            const atom2Index = bond.atoms[1];

            // Получаем атомы
            const atom1 = molecule.atoms[atom1Index];
            const atom2 = molecule.atoms[atom2Index];

            if (atom1 && atom2) {
                // Добавляем измерение расстояния
                viewer.addLabel(`${atom1.element}-${atom2.element}: ${bond.length}`, {
                    position: {
                        x: (atom1.coordinates[0] + atom2.coordinates[0]) / 2,
                        y: (atom1.coordinates[1] + atom2.coordinates[1]) / 2,
                        z: (atom1.coordinates[2] + atom2.coordinates[2]) / 2
                    },
                    backgroundColor: '#FFFFFF',
                    backgroundOpacity: 0.8,
                    fontSize: 12,
                    fontColor: '#000000'
                });
            }
        });
    }
}

// Обновление информации о молекуле на странице
function updateMoleculeInfo(moleculeId) {
    const molecule = MOLECULES[moleculeId];
    if (!molecule) return;

    // Основные характеристики
    document.getElementById('molecule-name').textContent = molecule.name || '';
    document.getElementById('molecule-formula').textContent = molecule.formula || '';
    document.getElementById('molecule-weight').textContent = molecule.weight || '';
    document.getElementById('molecule-type').textContent = molecule.type || '';

    // Структура
    if (molecule.atoms) {
        document.getElementById('atom-count').textContent = molecule.atoms.length;
    }

    if (molecule.bonds) {
        document.getElementById('bond-count').textContent = molecule.bonds.length;

        // Длины связей
        const bondLengths = molecule.bonds.map(bond => {
            if (molecule.atoms && bond.atoms && bond.atoms.length >= 2) {
                const atom1 = molecule.atoms[bond.atoms[0]];
                const atom2 = molecule.atoms[bond.atoms[1]];
                if (atom1 && atom2) {
                    return `${atom1.element}-${atom2.element}: ${bond.length || 'нет данных'}`;
                }
            }
            return '';
        }).filter(Boolean).join(', ');

        document.getElementById('bond-lengths').textContent = bondLengths || 'нет данных';
    }

    // Углы связей
    if (molecule.angles) {
        const angleStrings = Object.entries(molecule.angles)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        document.getElementById('bond-angles').textContent = angleStrings || 'нет данных';
    } else {
        document.getElementById('bond-angles').textContent = 'нет данных';
    }

    // Заполняем информацию об атомах
    updateAtomDetails(molecule);
}

// Обновление информации об атомах
function updateAtomDetails(molecule) {
    const atomDetails = document.getElementById('atom-details');
    if (!atomDetails || !molecule.atoms) return;

    // Очищаем текущее содержимое
    atomDetails.innerHTML = '';

    // Создаем карту для подсчета атомов каждого типа
    const atomCounts = {};

    // Подсчитываем атомы каждого типа
    molecule.atoms.forEach(atom => {
        const element = atom.element;
        if (!atomCounts[element]) {
            atomCounts[element] = 1;
        } else {
            atomCounts[element]++;
        }
    });

    // Цвета элементов (упрощенная схема)
    const elementColors = {
        'H': '#FFFFFF', 'C': '#808080', 'N': '#0000FF', 'O': '#FF0000',
        'F': '#90E050', 'P': '#FF8000', 'S': '#FFFF00', 'Cl': '#1FF01F'
    };

    // Создаем элементы для каждого типа атомов
    Object.entries(atomCounts).forEach(([element, count]) => {
        const atomItem = document.createElement('div');
        atomItem.className = 'atom-item';

        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'atom-color-indicator';
        colorIndicator.style.backgroundColor = elementColors[element] || '#CCCCCC';

        const elementName = getElementFullName(element);

        atomItem.innerHTML = `
            <span class="atom-color-indicator" style="background-color: ${elementColors[element] || '#CCCCCC'};"></span>
            <strong>${element} (${elementName})</strong> - ${count} ${getAtomPluralForm(count)}
        `;

        atomDetails.appendChild(atomItem);
    });
}

// Получение полного названия элемента
function getElementFullName(symbol) {
    const elements = {
        'H': 'Водород', 'He': 'Гелий', 'Li': 'Литий', 'Be': 'Бериллий',
        'B': 'Бор', 'C': 'Углерод', 'N': 'Азот', 'O': 'Кислород',
        'F': 'Фтор', 'Ne': 'Неон', 'Na': 'Натрий', 'Mg': 'Магний',
        'Al': 'Алюминий', 'Si': 'Кремний', 'P': 'Фосфор', 'S': 'Сера',
        'Cl': 'Хлор', 'Ar': 'Аргон', 'K': 'Калий', 'Ca': 'Кальций'
        // Можно добавить остальные элементы по необходимости
    };

    return elements[symbol] || symbol;
}

// Получение правильной формы слова "атом" в зависимости от количества
function getAtomPluralForm(count) {
    if (count === 1) {
        return 'атом';
    } else if (count >= 2 && count <= 4) {
        return 'атома';
    } else {
        return 'атомов';
    }
}

// Инициализация графика энергии
function initEnergyChart() {
    const ctx = document.getElementById('energy-chart').getContext('2d');

    // Пример данных для графика энергии (в реальности эти данные должны приходить из расчета)
    const energyData = {
        labels: ['0°', '60°', '120°', '180°', '240°', '300°', '360°'],
        datasets: [{
            label: 'Потенциальная энергия',
            data: [0, 5, 10, 12, 10, 5, 0],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // Создаем график
    new Chart(ctx, {
        type: 'line',
        data: energyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Энергия (ккал/моль)'
                    },
                    beginAtZero: true
                },
                x: {
                    title: {
                        display: true,
                        text: 'Угол вращения'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Зависимость энергии от угла вращения'
                }
            }
        }
    });
}

// Обновление отладочной информации
ffunction updateDebugInfo(message) {
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
        const timestamp = new Date().toLocaleTimeString();
        debugInfo.innerHTML += `<div>[${timestamp}] ${message}</div>`;

        // Ограничиваем количество сообщений, чтобы избежать переполнения
        if (debugInfo.children.length > 5) {
            debugInfo.removeChild(debugInfo.children[0]);
        }

        // Прокручиваем вниз, чтобы видеть последнее сообщение
        debugInfo.scrollTop = debugInfo.scrollHeight;
    }
}

// Генерация анимации молекулы
function generateAnimation() {
    // Получаем выбранные опции
    const moleculeId = document.getElementById('molecule').value;
    const representationType = document.getElementById('representation').value;
    animationSpeed = parseInt(document.getElementById('speed').value);

    // Показываем индикатор загрузки
    document.querySelector('.loading').style.display = 'flex';

    // Сбрасываем предыдущую анимацию, если она была
    if (isRotating) {
        toggleRotation();
    }

    // Загружаем молекулу и применяем выбранный тип представления
    loadMolecule(moleculeId);

    setTimeout(() => {
        // Для 3D представления начинаем вращение
        if (representationType === '3d') {
            // Показываем кнопку вращения
            document.getElementById('rotation-btn').style.display = 'inline-block';

            // Начинаем вращение
            toggleRotation();
        } else if (representationType === '2d') {
            // Для 2D представления используем Canvas
            generateFlatRepresentation(moleculeId);
        } else if (representationType === 'hybrid') {
            // Для гибридного представления комбинируем 3D и 2D
            generateHybridRepresentation(moleculeId);
        }

        // Скрываем индикатор загрузки
        document.querySelector('.loading').style.display = 'none';

        // Обновляем отладочную информацию
        updateDebugInfo(`Анимация для ${MOLECULES[moleculeId].name} сгенерирована`);
    }, 1000); // Небольшая задержка для имитации загрузки
}

// Создание 2D представления молекулы
function generateFlatRepresentation(moleculeId) {
    // Скрываем 3D контейнер
    document.getElementById('mol3d-container').style.display = 'none';

    // Показываем canvas для 2D рисования
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.display = 'block';

    // Получаем canvas контекст
    const ctx = canvasContainer.getContext('2d');

    // Очищаем canvas
    ctx.clearRect(0, 0, canvasContainer.width, canvasContainer.height);

    // Получаем данные о молекуле
    const molecule = MOLECULES[moleculeId];

    if (!molecule || !molecule.atoms) {
        updateDebugInfo('Ошибка: нет данных о молекуле');
        return;
    }

    // Расчет масштаба, чтобы молекула поместилась на canvas
    const padding = 50;
    let maxX = -Infinity, minX = Infinity, maxY = -Infinity, minY = Infinity;

    molecule.atoms.forEach(atom => {
        const x = atom.coordinates[0];
        const y = atom.coordinates[1];

        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
        maxY = Math.max(maxY, y);
        minY = Math.min(minY, y);
    });

    const width = canvasContainer.width - 2 * padding;
    const height = canvasContainer.height - 2 * padding;

    const scaleX = width / (maxX - minX || 1);
    const scaleY = height / (maxY - minY || 1);
    const scale = Math.min(scaleX, scaleY);

    // Элементарные цвета (упрощенно)
    const elementColors = {
        'H': '#FFFFFF',
        'C': '#808080',
        'N': '#0000FF',
        'O': '#FF0000',
        'F': '#90E050',
        'P': '#FF8000',
        'S': '#FFFF00',
        'Cl': '#1FF01F'
    };

    // Размеры атомов в относительных единицах
    const atomSizes = {
        'H': 1.0,
        'C': 1.7,
        'N': 1.55,
        'O': 1.52,
        'F': 1.47,
        'P': 1.8,
        'S': 1.8,
        'Cl': 1.75
    };

    // Функция для преобразования координат молекулы в координаты canvas
    function transformX(x) {
        return padding + (x - minX) * scale;
    }

    function transformY(y) {
        return canvasContainer.height - padding - (y - minY) * scale;
    }

    // Рисуем связи
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#666666';

    if (molecule.bonds) {
        molecule.bonds.forEach(bond => {
            const atom1 = molecule.atoms[bond.atoms[0]];
            const atom2 = molecule.atoms[bond.atoms[1]];

            if (atom1 && atom2) {
                const x1 = transformX(atom1.coordinates[0]);
                const y1 = transformY(atom1.coordinates[1]);
                const x2 = transformX(atom2.coordinates[0]);
                const y2 = transformY(atom2.coordinates[1]);

                // Рисуем линию связи
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // Если двойная или тройная связь
                if (bond.order > 1) {
                    // Вычисляем смещение для параллельных линий
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);

                    const offsetX = -dy / length * 3;
                    const offsetY = dx / length * 3;

                    // Вторая линия для двойной связи
                    ctx.beginPath();
                    ctx.moveTo(x1 + offsetX, y1 + offsetY);
                    ctx.lineTo(x2 + offsetX, y2 + offsetY);
                    ctx.stroke();

                    // Третья линия для тройной связи
                    if (bond.order > 2) {
                        ctx.beginPath();
                        ctx.moveTo(x1 - offsetX, y1 - offsetY);
                        ctx.lineTo(x2 - offsetX, y2 - offsetY);
                        ctx.stroke();
                    }
                }
            }
        });
    }

    // Рисуем атомы
    molecule.atoms.forEach(atom => {
        const x = transformX(atom.coordinates[0]);
        const y = transformY(atom.coordinates[1]);
        const radius = (atomSizes[atom.element] || 1.5) * 5;

        // Рисуем круг для атома
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        // Заполняем цветом атома
        ctx.fillStyle = elementColors[atom.element] || '#CCCCCC';
        ctx.fill();

        // Добавляем обводку для лучшей видимости
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Подписываем атом
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, x, y);
    });

    // Подписываем молекулу
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(molecule.formula, canvasContainer.width / 2, 20);
}

// Создание гибридного представления (комбинация 3D и 2D)
function generateHybridRepresentation(moleculeId) {
    // Реализация гибридного представления зависит от конкретных требований
    // Здесь мы можем, например, разделить экран на две части и показать оба представления

    // Для примера просто покажем 3D модель с дополнительной 2D схематической диаграммой
    // в небольшом окне в углу экрана

    // Отображаем 3D модель
    document.getElementById('mol3d-container').style.display = 'block';
    loadMolecule(moleculeId);

    // Начинаем вращение
    toggleRotation();

    // Также генерируем 2D представление в canvas
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.display = 'block';

    // Уменьшаем и позиционируем canvas для схематического представления
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.bottom = '10px';
    canvasContainer.style.right = '10px';
    canvasContainer.style.width = '150px';
    canvasContainer.style.height = '150px';
    canvasContainer.style.borderRadius = '5px';
    canvasContainer.style.border = '1px solid #888';
    canvasContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

    // Генерируем 2D представление
    generateFlatRepresentation(moleculeId);
}

// Переключение вращения молекулы
function toggleRotation() {
    if (isRotating) {
        // Останавливаем вращение
        clearInterval(rotationIntervalId);
        document.getElementById('rotation-btn').textContent = 'Начать вращение';
        isRotating = false;
    } else {
        // Начинаем вращение
        const speed = animationSpeed * 0.1; // Множитель для регулировки скорости
        rotationIntervalId = setInterval(() => {
            viewer.rotate(1, {x: 0, y: 1, z: 0});
            viewer.render();
        }, 50 / speed);
        document.getElementById('rotation-btn').textContent = 'Остановить вращение';
        isRotating = true;
    }
}

// Обновление скорости анимации
function updateAnimationSpeed(speed) {
    animationSpeed = parseInt(speed);

    // Если вращение активно, обновляем его скорость
    if (isRotating) {
        // Останавливаем текущее вращение
        clearInterval(rotationIntervalId);

        // Начинаем с новой скоростью
        const newSpeed = animationSpeed * 0.1;
        rotationIntervalId = setInterval(() => {
            viewer.rotate(1, {x: 0, y: 1, z: 0});
            viewer.render();
        }, 50 / newSpeed);
    }

    updateDebugInfo(`Скорость анимации обновлена: ${speed}`);
}

// Создание и скачивание GIF анимации
function downloadGif() {
    // Создаем индикатор загрузки
    document.querySelector('.loading').style.display = 'flex';

    // Создаем новый GIF с помощью библиотеки gif.js
    gif = new GIF({
        workers: 2,
        quality: 10,
        width: 600,
        height: 400
    });

    // Счетчик кадров
    let frames = 0;
    const totalFrames = 30; // Количество кадров в анимации

    // Сохраняем текущий ракурс
    const currentView = viewer.getView();

    // Генерируем кадры
    const generateFrame = () => {
        if (frames < totalFrames) {
            // Вращаем молекулу
            viewer.rotate(360 / totalFrames, {x: 0, y: 1, z: 0});
            viewer.render();

            // Добавляем кадр в GIF
            html2canvas(document.getElementById('mol3d-container')).then(canvas => {
                gif.addFrame(canvas, {delay: 100});
                frames++;

                // Генерируем следующий кадр
                generateFrame();
            });
        } else {
            // Все кадры собраны, создаем GIF
            gif.on('finished', function(blob) {
                // Скрываем индикатор загрузки
                document.querySelector('.loading').style.display = 'none';

                // Создаем ссылку для скачивания
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${MOLECULES[currentMolecule].name}.gif`;

                // Добавляем ссылку на страницу и кликаем по ней
                document.body.appendChild(link);
                link.click();

                // Удаляем ссылку
                document.body.removeChild(link);

                // Восстанавливаем исходный ракурс
                viewer.setView(currentView);
                viewer.render();

                updateDebugInfo('GIF анимация создана и скачана');
            });

            // Рендерим GIF
            gif.render();
        }
    };

    // Начинаем генерацию кадров
    generateFrame();
}

// Создание скриншота текущего вида молекулы
function takeScreenshot() {
    html2canvas(document.getElementById('mol3d-container')).then(canvas => {
        // Создаем ссылку для скачивания изображения
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${MOLECULES[currentMolecule].name}.png`;

        // Добавляем ссылку на страницу и кликаем по ней
        document.body.appendChild(link);
        link.click();

        // Удаляем ссылку
        document.body.removeChild(link);

        updateDebugInfo('Скриншот сохранен');
    });
}

// Увеличение масштаба молекулы
function zoomIn() {
    viewer.zoom(1.2);
    viewer.render();
    updateDebugInfo('Масштаб увеличен');
}

// Уменьшение масштаба молекулы
function zoomOut() {
    viewer.zoom(0.8);
    viewer.render();
    updateDebugInfo('Масштаб уменьшен');
}

// Центрирование молекулы в окне просмотра
function centerMolecule() {
    viewer.zoomTo();
    viewer.render();
    updateDebugInfo('Молекула центрирована');
}

// Обновление цвета фона
function updateBackgroundColor(color) {
    if (useGradientBackground) {
        // Если используется градиентный фон, выключаем его
        toggleGradientBackground();
    }

    viewer.setBackgroundColor(color);
    viewer.render();
    updateDebugInfo(`Цвет фона изменен на ${color}`);
}

// Переключение градиентного фона
function toggleGradientBackground() {
    const container = document.getElementById('mol3d-container');

    if (useGradientBackground) {
        // Выключаем градиентный фон
        container.style.background = '';
        useGradientBackground = false;

        // Восстанавливаем цвет фона в viewer
        const color = document.getElementById('background-color').value;
        viewer.setBackgroundColor(color);
    } else {
        // Включаем градиентный фон
        container.style.background = 'linear-gradient(135deg, #e3f2fd, #bbdefb, #90caf9, #64b5f6)';
        container.style.backgroundSize = '400% 400%';
        container.style.animation = 'gradient 15s ease infinite';
        useGradientBackground = true;

        // Для 3Dmol viewer устанавливаем прозрачный фон
        viewer.setBackgroundColor('transparent');
    }

    viewer.render();
    updateDebugInfo(`Градиентный фон ${useGradientBackground ? 'включен' : 'выключен'}`);
}

// Скачивание 3D модели
function downloadMolecule() {
    // Получаем текущую молекулу
    const molecule = MOLECULES[currentMolecule];

    // Создаем PDB файл для скачивания
    const pdbData = molecule.pdb;

    // Создаем blob и ссылку для скачивания
    const blob = new Blob([pdbData], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${molecule.name}.pdb`;

    // Добавляем ссылку на страницу и кликаем по ней
    document.body.appendChild(link);
    link.click();

    // Удаляем ссылку
    document.body.removeChild(link);

    updateDebugInfo(`3D модель ${molecule.name} скачана в формате PDB`);
}

// Инициализируем интерфейс при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем молекулу
    initializeMolecule();

    // Добавляем обработчики для селекторов
    document.getElementById('molecule').addEventListener('change', function() {
        const moleculeId = this.value;
        loadMolecule(moleculeId);
    });

    document.getElementById('molecule-style').addEventListener('change', function() {
        applyMoleculeStyle();
    });

    document.getElementById('coloring-scheme').addEventListener('change', function() {
        applyMoleculeStyle();
    });

    // Добавляем обработчики для чекбоксов
    document.getElementById('enhanced-colors').addEventListener('change', function() {
        applyVisualizationOptions();
    });

    document.getElementById('show-atoms-labels').addEventListener('change', function() {
        // Перезагружаем молекулу для применения изменений
        loadMolecule(currentMolecule);
    });

    document.getElementById('show-bonds-labels').addEventListener('change', function() {
        // Перезагружаем молекулу для применения изменений
        loadMolecule(currentMolecule);
    });

    document.getElementById('show-electron-density').addEventListener('change', function() {
        // Перезагружаем молекулу для применения изменений
        loadMolecule(currentMolecule);
    });

    document.getElementById('show-measurements').addEventListener('change', function() {
        // Перезагружаем молекулу для применения изменений
        loadMolecule(currentMolecule);
    });

    // Добавляем обработчик для изменения размера атомов и связей
    document.getElementById('atom-size').addEventListener('input', function() {
        document.getElementById('atom-size-value').textContent = this.value;
        applyMoleculeStyle();
    });

    document.getElementById('bond-size').addEventListener('input', function() {
        document.getElementById('bond-size-value').textContent = this.value;
        applyMoleculeStyle();
    });

    // Обработчики для элементов управления скоростью
    document.getElementById('speed').addEventListener('input', function() {
        document.getElementById('speed-value').textContent = this.value;
        updateAnimationSpeed(this.value);
    });

    // Настраиваем обработчики для вкладок интерфейса, если они еще не настроены
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Деактивируем все вкладки
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Активируем выбранную вкладку
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    updateDebugInfo('Интерфейс молекулярной визуализации инициализирован');
});