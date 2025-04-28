CSS: 
:root {
    --primary-color: #1a3a5f;
    --secondary-color: #3d6a9c;
    --accent-color: #3498db;
    --light-gray: #f2f2f2;
    --dark-gray: #333;
    --border-color: #ddd;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: var(--light-gray);
    color: var(--dark-gray);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    background-color: var(--primary-color);
    color: white;
    padding: 20px 0;
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 5px solid var(--secondary-color);
}

h1, h2, h3 {
    font-weight: 700;
    margin-bottom: 15px;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.gallery-item {
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: translateY(-5px);
}

.gallery-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    scale: 0.9;
}

.gallery-item .description {
    padding: 15px;
    border-top: 3px solid var(--accent-color);
}

.technical-specs, .calculator, .file-upload {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.technical-specs h2, .calculator h2, .file-upload h2 {
    color: var(--primary-color);
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.specs-table {
    width: 100%;
    border-collapse: collapse;
}

.specs-table th, .specs-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.specs-table th {
    background-color: var(--secondary-color);
    color: white;
}

.specs-table tr:nth-child(even) {
    background-color: var(--light-gray);
}

.input-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.input-field {
    margin-bottom: 15px;
}

.input-field label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--primary-color);
}

.input-field input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    font-size: 16px;
}

.btn {
    background-color: var(--accent-color);
    color: white;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.3s ease;
    margin-right: 10px;
    margin-bottom: 10px;
}

.btn:hover {
    background-color: var(--secondary-color);
}

.btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.results {
    background-color: var(--light-gray);
    padding: 20px;
    border-radius: 5px;
    margin-top: 20px;
    display: none;
}

.results h3 {
    color: var(--primary-color);
    margin-bottom: 15px;
}

.result-item {
    margin-bottom: 10px;
    padding: 10px;
    background-color: white;
    border-left: 3px solid var(--accent-color);
}

.result-item span {
    font-weight: 700;
    color: var(--primary-color);
}

/* Стилі для завантаження файлів */
.upload-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.file-label {
    display: inline-block;
    padding: 12px 20px;
    background-color: var(--secondary-color);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.file-label:hover {
    background-color: var(--primary-color);
}

input[type="file"] {
    display: none;
}

.saved-calculations {
    margin-top: 20px;
    display: none;
}

.saved-calculations h3 {
    color: var(--primary-color);
    margin-bottom: 15px;
}

.saved-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 10px;
}

.saved-item {
    background-color: var(--light-gray);
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    border-left: 3px solid var(--accent-color);
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.saved-item:hover {
    background-color: #e5e5e5;
}

.saved-item h4 {
    color: var(--primary-color);
    margin-bottom: 5px;
}

.saved-item-details {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 14px;
}

.saved-detail {
    background-color: white;
    padding: 5px 10px;
    border-radius: 3px;
}

.saved-detail span {
    font-weight: 600;
    color: var(--secondary-color);
}

footer {
    background-color: var(--primary-color);
    color: white;
    text-align: center;
    padding: 20px 0;
    margin-top: 30px;
}

@media (max-width: 768px) {
    .gallery {
        grid-template-columns: 1fr;
    }
    
    .input-group {
        grid-template-columns: 1fr;
    }
    
    .upload-container {
        flex-direction: column;
        align-items: stretch;
    }
}

.result-actions {
    margin-top: 20px;
    text-align: right;
}

#export-text-btn {
    background-color: #27ae60;
    margin-right: 0;
}

#export-text-btn:hover {
    background-color: #219653;
}
