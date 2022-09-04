export const formTemplate = `
    
<form id="add-form" class="add-form">
    <div class="form-title">Отзыв:</div> 
    <div class="form-content">
        <input type="text" placeholder="Укажите ваше имя" name="author" required>
        <input type="text" placeholder="Укажите место" name="place" required>
        <textarea placeholder="Оставить отзыв" name="review" required></textarea>
    </div>      
    <button id="add-btn">Добавить</button>
</form>
`;