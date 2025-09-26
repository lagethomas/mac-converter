document.addEventListener('DOMContentLoaded', function() {
    const macInput = document.getElementById('macInput');
    const macError = document.getElementById('macError');
    const generateBtn = document.getElementById('generateBtn');
    const copyMessage = document.getElementById('copyMessage'); // Referência à mensagem de copiado

    // Referências aos elementos de resultado
    const resultElements = {
        formatDashHyphen: document.getElementById('formatDashHyphen'),
        formatColon: document.getElementById('formatColon'),
        formatDot: document.getElementById('formatDot'),
        formatNoSeparator: document.getElementById('formatNoSeparator'),
        formatSpaces: document.getElementById('formatSpaces'),
        formatHP: document.getElementById('formatHP'),
        formatFourByFour: document.getElementById('formatFourByFour') // Novo elemento adicionado
    };

    // Função para normalizar o MAC Address (remove separadores e converte para maiúsculas)
    function normalizeMac(mac) {
        if (!mac) return '';
        return mac.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    }

    // Função para validar o MAC Address normalizado
    function isValidNormalizedMac(normalizedMac) {
        return normalizedMac.length === 12 && /^[0-9A-F]{12}$/.test(normalizedMac);
    }

    // Função para formatar o MAC Address
    function formatMac(normalizedMac, separator, groupSize, lowercase = false) {
        if (!normalizedMac) return '';
        let formatted = '';
        for (let i = 0; i < normalizedMac.length; i += groupSize) {
            formatted += normalizedMac.substring(i, i + groupSize);
            if (i + groupSize < normalizedMac.length) {
                formatted += separator;
            }
        }
        return lowercase ? formatted.toLowerCase() : formatted;
    }

    // Função para limpar os resultados
    function clearResults() {
        macError.textContent = '';
        for (const key in resultElements) {
            resultElements[key].textContent = '';
            // Remover event listeners antigos para evitar duplicação (opcional, mas boa prática)
            resultElements[key].onclick = null;
        }
    }

    // Função para copiar texto para a área de transferência
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyMessage();
        }).catch(function(err) {
            console.error('Erro ao copiar para a área de transferência: ', err);
            // Poderia mostrar uma mensagem de erro aqui
        });
    }

    // Função para mostrar a mensagem de "Copiado!"
    let copyMessageTimeout;
    function showCopyMessage() {
        copyMessage.classList.add('show');
        clearTimeout(copyMessageTimeout); // Limpa qualquer timeout anterior
        copyMessageTimeout = setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000); // Mensagem some após 2 segundos
    }

    generateBtn.addEventListener('click', function() {
        clearResults();

        const rawMac = macInput.value.trim();
        const normalizedMac = normalizeMac(rawMac);

        if (!isValidNormalizedMac(normalizedMac)) {
            macError.textContent = 'Por favor, insira um MAC Address válido (12 caracteres hexadecimais).';
            return;
        }

        // --- Geração e exibição das variações ---
        const variations = {
            dashHyphen: formatMac(normalizedMac, '-', 2),
            colon: formatMac(normalizedMac, ':', 2),
            dot: formatMac(normalizedMac, '.', 4),
            noSeparator: normalizedMac,
            spaces: formatMac(normalizedMac, ' ', 2),
            hp: `${formatMac(normalizedMac.substring(0, 6), '', 6)}-${formatMac(normalizedMac.substring(6), '', 6)}`,
            fourByFour: `${normalizedMac.substring(0, 4)}-${normalizedMac.substring(4, 8)}-${normalizedMac.substring(8, 12)}` // Novo formato
        };

        resultElements.formatDashHyphen.textContent = variations.dashHyphen;
        resultElements.formatColon.textContent = variations.colon;
        resultElements.formatDot.textContent = variations.dot;
        resultElements.formatNoSeparator.textContent = variations.noSeparator;
        resultElements.formatSpaces.textContent = variations.spaces;
        resultElements.formatHP.textContent = variations.hp;
        resultElements.formatFourByFour.textContent = variations.fourByFour; // Exibe o novo formato

        // --- Adiciona event listeners para copiar ---
        for (const key in resultElements) {
            if (resultElements[key].textContent) { // Só adiciona se o conteúdo não estiver vazio
                const textToCopy = resultElements[key].textContent;
                resultElements[key].onclick = () => copyToClipboard(textToCopy);
            }
        }
    });
});