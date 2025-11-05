document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const modalCadastro = document.getElementById('modal-cadastro');
    const registrationForm = document.getElementById('registration-form');
    const appContainer = document.getElementById('app-container');
    const spinButton = document.getElementById('spin-button');
    const wheel = document.getElementById('wheel');
    
    const modalResultado = document.getElementById('modal-resultado');
    const prizeResultText = document.getElementById('prize-result');
    const closeResultModal = document.getElementById('close-result-modal');

    // --- Definição dos Prêmios ---
    const prizes = [
        "BOMBOM",
        "ADESIVO",
        "BRINDE LETRINHA",
        "TENTE NOVAMENTE",
        "BOMBOM"
    ];
    
    const numSegments = prizes.length;
    const segmentAngle = 360 / numSegments;
    let isSpinning = false;
    let currentWheelRotation = 0;

    // --- Lógica do Formulário ---
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData.entries());
        console.log("Dados do participante:", data);

        // --- Envia os dados para a API ---
        try {
            const response = await fetch('https://dashboard.sensoramaplay.com/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erro ao enviar os dados: ${response.status}`);
            }

            const result = await response.json();
            console.log("Lead registrado com sucesso:", result);

            // Se deu certo, mostra a roleta
            modalCadastro.classList.remove('active');
            appContainer.style.display = 'flex';

        } catch (error) {
            console.error('Erro ao cadastrar lead:', error);
            alert('Ocorreu um erro ao enviar seus dados. Tente novamente.');
        }
    });

    // --- Lógica do Giro ---
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        spinButton.disabled = true;
        spinButton.style.cursor = 'not-allowed';
        spinButton.innerHTML = '...';

        const prizeIndex = Math.floor(Math.random() * numSegments);
        const prizeName = prizes[prizeIndex];
        
        const prizeCenterAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2);
        const randomOffset = Math.random() * (segmentAngle - 20) - ((segmentAngle - 20) / 2);
        const rotationToPrizeCenter = (360 - prizeCenterAngle);
        const extraSpins = 360 * 5;
        const totalRotation = currentWheelRotation + extraSpins + rotationToPrizeCenter + randomOffset;
        currentWheelRotation = totalRotation;

        wheel.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            prizeResultText.textContent = 
                prizeName === 'TENTE NOVAMENTE'
                ? 'Não foi dessa vez... TENTE NOVAMENTE!'
                : `Parabéns! Você ganhou: ${prizeName}!`;

            modalResultado.classList.add('active');
        }, 5100); 
    });

    // --- Lógica do Modal de Resultado ---
    closeResultModal.addEventListener('click', () => {
        modalResultado.classList.remove('active');
        
        isSpinning = false;
        spinButton.disabled = false;
        spinButton.style.cursor = 'pointer';
        spinButton.innerHTML = 'GIRAR';
        
        appContainer.style.display = 'none';
        modalCadastro.classList.add('active');
        registrationForm.reset(); 
    });

});
