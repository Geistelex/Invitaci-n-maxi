const TELEGRAM_BOT_TOKEN = '8263556444:AAFNu7oh4yqDTI2H2mdEMi7rAFKRHTKh8MM'; // Reemplaza con tu token
const TELEGRAM_CHAT_ID = '8149518707'; // Reemplaza con tu Chat ID
const SERVER_URL = 'https://invitaci-n-maxi.onrender.com'; // Reemplaza con tu URL de Render

export async function notificarConfirmacion(idInvitado) {
    try {
    // 1. Enviar confirmación al servidor en Render y obtener el total actualizado
    const response = await fetch(`${SERVER_URL}/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idInvitado }),
    });
    const { total } = await response.json();

    // 2. Notificar a Telegram con el contador global
    const mensaje = `🎉 Nueva confirmación:\n- ID: ${idInvitado}\n- Total confirmaciones: ${total}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        }),
    });

    console.log('Contador actualizado en Telegram:', total);
    } catch (error) {
    console.error('Error al notificar:', error);
    }

}

