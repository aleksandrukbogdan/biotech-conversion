<?php
header('Content-Type: application/json; charset=utf-8');

// Логирование для отладки
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Форма получена\n", FILE_APPEND);
file_put_contents('debug.log', "POST данные: " . print_r($_POST, true) . "\n", FILE_APPEND);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    try {
        // Ваш email (ЗАМЕНИТЕ НА СВОЙ!)
        $to = "biotech.info@mail.ru";
        
        // Данные из формы
        $data = [
            'fullname' => htmlspecialchars($_POST['fullname'] ?? ''),
            'position' => htmlspecialchars($_POST['position'] ?? ''),
            'organization' => htmlspecialchars($_POST['organization'] ?? ''),
            'email' => htmlspecialchars($_POST['email'] ?? ''),
            'research_goal' => htmlspecialchars($_POST['research_goal'] ?? ''),
            'parameters' => htmlspecialchars($_POST['parameters'] ?? ''),
            'samples' => htmlspecialchars($_POST['samples'] ?? ''),
            'timestamp' => date('d.m.Y H:i')
        ];
        
        // Проверка обязательных полей
        $required = ['fullname', 'position', 'organization', 'email', 'research_goal', 'parameters'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("Не заполнено поле: $field");
            }
        }
        
        // Тема и тело письма
        $subject = "✅ Заявка на консультацию: {$data['organization']}";
        
        $message = "
        🎯 Новая заявка на техническую консультацию
        
        👤 ФИО: {$data['fullname']}
        💼 Должность: {$data['position']}
        🏢 Организация: {$data['organization']}
        📧 Email: {$data['email']}
        🎯 Цель исследования: {$data['research_goal']}
        🔬 Параметры: {$data['parameters']}
        🧪 Тип образцов: {$data['samples']}
        ⏰ Дата: {$data['timestamp']}
        ";
        
        // Заголовки
        $headers = "From: ScienceDevice <noreply@sciencedevice.ru>\r\n";
        $headers .= "Reply-To: {$data['email']}\r\n";
        $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        // Отправка email
        if (mail($to, $subject, $message, $headers)) {
            $response = [
                'status' => 'success',
                'message' => 'Заявка отправлена успешно!'
            ];
            file_put_contents('debug.log', "Email отправлен успешно\n", FILE_APPEND);
        } else {
            throw new Exception('Ошибка отправки email');
        }
        
    } catch (Exception $e) {
        $response = [
            'status' => 'error',
            'message' => $e->getMessage()
        ];
        file_put_contents('debug.log', "Ошибка: " . $e->getMessage() . "\n", FILE_APPEND);
    }
    
} else {
    $response = [
        'status' => 'error',
        'message' => 'Неверный метод запроса'
    ];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>