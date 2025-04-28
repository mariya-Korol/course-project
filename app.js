
let resultsDiv;
let rollerSupportType, rollerDiameter, upperRollerDistance, lowerRollerDistance, circumferentialForce, beltTension, drivePower;

document.addEventListener('DOMContentLoaded', function() {
    
    resultsDiv = document.getElementById('results');

    
    rollerSupportType = document.getElementById('roller-support-type');
    rollerDiameter = document.getElementById('roller-diameter');
    upperRollerDistance = document.getElementById('upper-roller-distance');
    lowerRollerDistance = document.getElementById('lower-roller-distance');
    circumferentialForce = document.getElementById('circumferential-force');
    beltTension = document.getElementById('belt-tension');
    drivePower = document.getElementById('drive-power');

    
    const calculateBtn = document.getElementById('calculate-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const jsonFileInput = document.getElementById('json-file');
    const savedCalculations = document.getElementById('saved-calculations');
    const savedList = document.getElementById('saved-list');
    
    
    calculateBtn.addEventListener('click', calculateParameters);
    saveBtn.addEventListener('click', saveCalculation);
    loadBtn.addEventListener('click', loadFiles);
    
    
    let loadedCalculations = [];
    
    
    function calculateParameters() {
        
        const calculationName = document.getElementById('calculation-name').value.trim();
        if (!calculationName) {
            alert("Будь ласка, введіть назву розрахунку!");
            return;
        }
        
        
        const beltWidth = parseFloat(document.getElementById('belt-width').value);
        const beltSpeed = parseFloat(document.getElementById('belt-speed').value);
        const load = parseFloat(document.getElementById('load').value);
        const conveyorLength = parseFloat(document.getElementById('conveyor-length').value);
        const inclineAngle = parseFloat(document.getElementById('incline-angle').value);
        const efficiency = parseFloat(document.getElementById('efficiency').value);
        
        
        let supportType = '';
        if (beltWidth <= 650) {
            supportType = 'Жолобчаста, 3-роликова';
        } else if (beltWidth <= 1200) {
            supportType = 'Жолобчаста, 3-роликова, посилена';
        } else {
            supportType = 'Жолобчаста, 5-роликова, важка';
        }
        
        
        const rollerDiameterValue = Math.round(beltWidth * 0.15);
        
        
        const upperDistance = Math.round((0.8 + beltWidth * 0.0006) * 10) / 10;
        const lowerDistance = Math.round(upperDistance * 2.5 * 10) / 10;
        
        
        
        const g = 9.81; 
        const k1 = 1.1; 
        const q0 = beltWidth * 0.01; 
        const qp = beltWidth * 0.015; 
        const angleRad = inclineAngle * Math.PI / 180; 
        
        const force = g * conveyorLength * (k1 * load + q0 + 2 * qp * Math.cos(angleRad) + conveyorLength * load * Math.sin(angleRad) / 2);
        
        
        const tension = force * 1.3; 
        
        const power = (force * beltSpeed) / (1000 * efficiency);
        
        
        rollerSupportType.textContent = supportType;
        rollerDiameter.textContent = rollerDiameterValue;
        upperRollerDistance.textContent = upperDistance;
        lowerRollerDistance.textContent = lowerDistance;
        circumferentialForce.textContent = Math.round(force);
        beltTension.textContent = Math.round(tension);
        drivePower.textContent = Math.round(power * 100) / 100;
        
        
        resultsDiv.style.display = 'block';
        saveBtn.disabled = false;
    }
    
    
    function saveCalculation() {
        
        const calculationName = document.getElementById('calculation-name').value.trim();
        if (!calculationName) {
            alert("Будь ласка, введіть назву розрахунку!");
            return;
        }
        
       
        const beltWidth = parseFloat(document.getElementById('belt-width').value);
        const beltSpeed = parseFloat(document.getElementById('belt-speed').value);
        const load = parseFloat(document.getElementById('load').value);
        const conveyorLength = parseFloat(document.getElementById('conveyor-length').value);
        const inclineAngle = parseFloat(document.getElementById('incline-angle').value);
        const efficiency = parseFloat(document.getElementById('efficiency').value);
        
        
        const rollerSupport = rollerSupportType.textContent;
        const rollerDiam = rollerDiameter.textContent;
        const upRollerDist = upperRollerDistance.textContent;
        const lowRollerDist = lowerRollerDistance.textContent;
        const circForce = circumferentialForce.textContent;
        const beltTens = beltTension.textContent;
        const drivePow = drivePower.textContent;
        
        
        const data = {
            name: calculationName,
            timestamp: new Date().toISOString(),
            inputParameters: {
                beltWidth: beltWidth,
                beltSpeed: beltSpeed,
                load: load,
                conveyorLength: conveyorLength,
                inclineAngle: inclineAngle,
                efficiency: efficiency
            },
            calculatedParameters: {
                rollerSupportType: rollerSupport,
                rollerDiameter: rollerDiam,
                upperRollerDistance: upRollerDist,
                lowerRollerDistance: lowRollerDist,
                circumferentialForce: circForce,
                beltTension: beltTens,
                drivePower: drivePow
            }
        };
        
        
        const jsonString = JSON.stringify(data, null, 2);
        
        
        localStorage.setItem('conveyorCalculation_' + Date.now(), jsonString);
        
        
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        
        const a = document.createElement('a');
        a.href = url;
        
        const safeName = calculationName.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9_\-]/g, '_');
        a.download = safeName + '_' + new Date().toISOString().slice(0, 10) + '.json';
        
        
        document.body.appendChild(a);
        a.click();
        
        
        setTimeout(function() {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        alert('Розрахунок "' + calculationName + '" успішно збережено!');
    }
    
    
    function loadFiles() {
        const files = jsonFileInput.files;
        
        if (files.length === 0) {
            alert('Будь ласка, виберіть хоча б один JSON-файл!');
            return;
        }
        
        // Очищення масиву завантажених розрахунків та списку на сторінці
        loadedCalculations = [];
        savedList.innerHTML = '';
        
        let filesProcessed = 0;
        
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const calculation = JSON.parse(e.target.result);
                    
                    calculation.fileName = file.name;
                    loadedCalculations.push(calculation);
                    
       const itemElement = createSavedCalculationItem(calculation, loadedCalculations.length - 1);
                    savedList.appendChild(itemElement);
                } catch (error) {
                    console.error('Помилка при обробці файлу:', file.name, error);
                    alert('Помилка при обробці файлу ' + file.name + ': ' + error.message);
                }
                
                filesProcessed++;
                
                
                if (filesProcessed === files.length) {
                    savedCalculations.style.display = 'block';
                }
            };
            
            reader.onerror = function() {
                alert('Помилка читання файлу ' + file.name);
                filesProcessed++;
            };
            
            reader.readAsText(file);
        });
    }
    
    function createSavedCalculationItem(calculation, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'saved-item';
        itemDiv.dataset.index = index;
        
        
        const name = calculation.name || 'Розрахунок без назви';
        const date = new Date(calculation.timestamp).toLocaleString('uk-UA');
        
        itemDiv.innerHTML = `
            <h4>${name}</h4>
            <div class="saved-item-details">
                <div class="saved-detail"><span>Дата:</span> ${date}</div>
                <div class="saved-detail"><span>Ширина стрічки:</span> ${calculation.inputParameters.beltWidth} мм</div>
                <div class="saved-detail"><span>Швидкість:</span> ${calculation.inputParameters.beltSpeed} м/с</div>
                <div class="saved-detail"><span>Довжина:</span> ${calculation.inputParameters.conveyorLength} м</div>
            </div>
        `;
        
        itemDiv.addEventListener('click', function() {
            loadCalculationToForm(calculation);
        });
        
        return itemDiv;
    }
    
    function loadCalculationToForm(calculation) {
        document.getElementById('calculation-name').value = calculation.name || '';
        document.getElementById('belt-width').value = calculation.inputParameters.beltWidth;
        document.getElementById('belt-speed').value = calculation.inputParameters.beltSpeed;
        document.getElementById('load').value = calculation.inputParameters.load;
        document.getElementById('conveyor-length').value = calculation.inputParameters.conveyorLength;
        document.getElementById('incline-angle').value = calculation.inputParameters.inclineAngle;
        document.getElementById('efficiency').value = calculation.inputParameters.efficiency;
        
        rollerSupportType.textContent = calculation.calculatedParameters.rollerSupportType;
        rollerDiameter.textContent = calculation.calculatedParameters.rollerDiameter;
        upperRollerDistance.textContent = calculation.calculatedParameters.upperRollerDistance;
        lowerRollerDistance.textContent = calculation.calculatedParameters.lowerRollerDistance;
        circumferentialForce.textContent = calculation.calculatedParameters.circumferentialForce;
        beltTension.textContent = calculation.calculatedParameters.beltTension;
        drivePower.textContent = calculation.calculatedParameters.drivePower;
        
        
        resultsDiv.style.display = 'block';
        saveBtn.disabled = false;
        
        
        document.querySelector('.calculator').scrollIntoView({ behavior: 'smooth' });
        
        alert(`Розрахунок "${calculation.name || 'без назви'}" завантажено у форму калькулятора`);
    }
    
    
    function loadSavedCalculationsFromStorage() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (key.startsWith('conveyorCalculation_')) {
                try {
                    const calculation = JSON.parse(localStorage.getItem(key));
                    loadedCalculations.push(calculation);
                    
                    
                    const itemElement = createSavedCalculationItem(calculation, loadedCalculations.length - 1);
                    savedList.appendChild(itemElement);
                } catch (error) {
                    console.error('Помилка при завантаженні з localStorage:', key, error);
                }
            }
        }
        
      
        if (loadedCalculations.length > 0) {
            savedCalculations.style.display = 'block';
        }
    }
    
    
    const uploadContainer = document.querySelector('.upload-container');
    
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadContainer.classList.add('dragover');
    });
    
    uploadContainer.addEventListener('dragleave', function() {
        uploadContainer.classList.remove('dragover');
    });
    
    uploadContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadContainer.classList.remove('dragover');
        
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            jsonFileInput.files = files;
            loadFiles();
        }
    });
    
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.id = 'clear-btn';
    clearBtn.className = 'btn';
    clearBtn.textContent = 'Очистити форму';
    clearBtn.addEventListener('click', function() {
        document.getElementById('calculator-form').reset();
        resultsDiv.style.display = 'none';
        saveBtn.disabled = true;
    });
    
    
    document.querySelector('.buttons').appendChild(clearBtn);
    
    loadSavedCalculationsFromStorage();
});

document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .upload-container.dragover {
            border: 2px dashed var(--accent-color);
            background-color: rgba(52, 152, 219, 0.1);
            padding: 15px;
            border-radius: 5px;
        }
    `;
    document.head.appendChild(style);
});

let exportTextBtn;

setTimeout(function() {
    exportTextBtn = document.getElementById('export-text-btn');
    if (exportTextBtn) {
        exportTextBtn.addEventListener('click', exportResultsAsText);
    } else {
        console.error('Елемент з ID "export-text-btn" не знайдено!');
    }
}, 100);

function exportResultsAsText() {
    console.log("Функція експорту викликана");
    
    if (resultsDiv.style.display !== 'block') {
        alert('Спочатку виконайте розрахунок!');
        return;
    }
    
    
    const supportType = rollerSupportType.textContent;
    const rollerDiam = rollerDiameter.textContent;
    const upRollerDist = upperRollerDistance.textContent;
    const lowRollerDist = lowerRollerDistance.textContent;
    const circForce = circumferentialForce.textContent;
    const beltTens = beltTension.textContent;
    const drivePow = drivePower.textContent;
    
    const calculationName = document.getElementById('calculation-name').value.trim() || 'Розрахунок_без_назви';
    
    
    const beltWidth = document.getElementById('belt-width').value;
    const beltSpeed = document.getElementById('belt-speed').value;
    const load = document.getElementById('load').value;
    const conveyorLength = document.getElementById('conveyor-length').value;
    const inclineAngle = document.getElementById('incline-angle').value;
    const efficiency = document.getElementById('efficiency').value;
    
 
    const currentDate = new Date().toLocaleString('uk-UA');
    let textContent = `РЕЗУЛЬТАТИ РОЗРАХУНКУ ПАРАМЕТРІВ ПРИВОДУ СТРІЧКОВОГО КОНВЕЄРА\n`;
    textContent += `================================================\n\n`;
    textContent += `Назва розрахунку: ${calculationName}\n`;
    textContent += `Дата: ${currentDate}\n\n`;
    
    textContent += `ВХІДНІ ПАРАМЕТРИ:\n`;
    textContent += `------------------------------------------------\n`;
    textContent += `Ширина стрічки: ${beltWidth} мм\n`;
    textContent += `Швидкість руху стрічки: ${beltSpeed} м/с\n`;
    textContent += `Погонне навантаження: ${load} кг/м\n`;
    textContent += `Довжина конвеєра: ${conveyorLength} м\n`;
    textContent += `Кут нахилу конвеєра: ${inclineAngle}°\n`;
    textContent += `ККД привода: ${efficiency}\n\n`;
    
    textContent += `РЕЗУЛЬТАТИ РОЗРАХУНКУ:\n`;
    textContent += `------------------------------------------------\n`;
    textContent += `Характеристики роликоопор: ${supportType}\n`;
    textContent += `Рекомендований діаметр ролика: ${rollerDiam} мм\n`;
    textContent += `Відстань між верхніми роликоопорами: ${upRollerDist} м\n`;
    textContent += `Відстань між нижніми роликоопорами: ${lowRollerDist} м\n`;
    textContent += `Окружне зусилля: ${circForce} Н\n`;
    textContent += `Натяг гілки: ${beltTens} Н\n`;
    textContent += `Потужність привода: ${drivePow} кВт\n\n`;
    
    textContent += `================================================\n`;
    textContent += `Розробка ескізного проекту приводу стрічкового конвеєра\n`;
    textContent += `(c) 2025\n`;
    
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    
    
    const url = URL.createObjectURL(blob);
    
    
    const a = document.createElement('a');
    a.href = url;
    
    const safeName = calculationName.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9_\-]/g, '_');
    a.download = safeName + '_результати_' + new Date().toISOString().slice(0, 10) + '.txt';
    
    console.log("Намагаюсь завантажити файл:", a.download);
    
    
    document.body.appendChild(a);
    a.click();
    
   
    setTimeout(function() {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
