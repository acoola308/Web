window.onload = function() { 
    let a = '';
    let b = '';
    let expressionResult = '';
    let selectedOperation = null;
    let expressionString = ''; 
    let isAccumulated = false; // Флаг для накопленного результата

    const outputElement = document.getElementById("result");

    function updateOutput(value) {
        if (isNaN(value)) {
            resetCalculator(); // Сбрасываем калькулятор
            outputElement.innerHTML = 'NaN'; // Показываем сообщение об ошибке
            return;
        }

        outputElement.innerHTML = value;

        if (outputElement.scrollWidth > outputElement.clientWidth) {
            outputElement.classList.add('scrolling-text');
        } else {
            outputElement.classList.remove('scrolling-text');
        }

        outputElement.scrollLeft = outputElement.scrollWidth;
    }

    function resetCalculator() {
        a = '';
        b = '';
        selectedOperation = null;
        expressionResult = '';
        expressionString = '';
        isAccumulated = false;
        updateOutput('0'); // Вернуть к начальному состоянию
    }
    
    function checkInfinity() {
        if (outputElement.innerHTML === 'Infinity') {
            resetCalculator();
            return true;
        }
        return false;
    }

    function onDigitButtonClicked(digit) {
        if (checkInfinity()) return;

        // Предотвращаем ввод, если текущий результат NaN
        if (isNaN(+a) || isNaN(+b)) return;

        if (!selectedOperation) {
            if (digit === '0' && a === '0') return; // Блокируем ведущие нули
            if ((digit !== '.') || (digit === '.' && !a.includes(digit))) {
                a = (a === '0' && digit !== '.' ? '' : a) + digit; // Убираем лишний 0
            }
            updateOutput(a || '0');
        } else {
            if (digit === '0' && b === '0') return; // Блокируем ведущие нули
            if ((digit !== '.') || (digit === '.' && !b.includes(digit))) {
                b = (b === '0' && digit !== '.' ? '' : b) + digit; // Убираем лишний 0
            }
            expressionString = a + ' ' + selectedOperation + ' ' + b;
            updateOutput(expressionString);
        }
    }

    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    document.getElementById("btn_op_mult").onclick = function() { 
        if (checkInfinity()) return;
        if (selectedOperation) return;
        if (a === '') return;
        selectedOperation = '×';
        expressionString = a + ' ' + selectedOperation; 
        updateOutput(expressionString);
    }
    
    document.getElementById("btn_op_plus").onclick = function() { 
        if (checkInfinity()) return;
        if (selectedOperation) { 
            selectedOperation = '+';
        } else {
            if (a === '') return;
            if (isAccumulated) {
                a = expressionResult.toString();
            }
            selectedOperation = '+';
        }
        expressionString = a + ' ' + selectedOperation;
        updateOutput(expressionString);
        isAccumulated = true;
    }
    
    document.getElementById("btn_op_minus").onclick = function() { 
        if (checkInfinity()) return;
        if (selectedOperation) { 
            selectedOperation = '-';
        } else {
            if (a === '') return;
            if (isAccumulated) {
                a = expressionResult.toString();
            }
            selectedOperation = '-';
        }
        expressionString = a + ' ' + selectedOperation;
        updateOutput(expressionString);
        isAccumulated = true;
    }
    
    document.getElementById("btn_op_div").onclick = function() { 
        if (checkInfinity()) return;
        if (selectedOperation) {
            selectedOperation = '/';
        } else {
            if (a === '') return;
            selectedOperation = '/';
        }
        expressionString = a + ' ' + selectedOperation;
        updateOutput(expressionString);
    }

    document.getElementById("btn_op_clear").onclick = resetCalculator;

    document.getElementById("btn_op_sign").onclick = function() {
        checkInfinity();
        if (b === '' && a !== '') {
            a = (-a).toString();
            updateOutput(a);
        } else if (b !== '') {
            b = (-b).toString();
            expressionString = a + ' ' + (selectedOperation || '') + ' ' + b;
            updateOutput(expressionString);
        }
    }

    document.getElementById("btn_op_percent").onclick = function() {
        if (checkInfinity()) return;
        if (b === '' && a !== '') {
            a = (+a / 100).toString();
            expressionString = a + ' ' + (selectedOperation || '') + ' ' + b;
            updateOutput(expressionString);
        } else if (b !== '') {
            b = (+b / 100).toString();
            expressionString = a + ' ' + (selectedOperation || '') + ' ' + b;
            updateOutput(expressionString);
        }
    }

    document.getElementById("btn_op_equal").onclick = function() { 
        if (checkInfinity()) return;
        if (a === '' || b === '' || !selectedOperation) return;

        switch(selectedOperation) { 
            case '×':
                expressionResult = (+a) * (+b);
                break;
            case '+':
                expressionResult = (+a) + (+b);
                break;
            case '-':
                expressionResult = (+a) - (+b);
                break;
            case '/':
                expressionResult = (+a) / (+b);
                break;
        }

        updateOutput(expressionResult); 
        a = expressionResult.toString(); 
        b = '';
        selectedOperation = null;
        isAccumulated = false;
    }

    document.getElementById("btn_op_backspace").onclick = function() {
        if (checkInfinity()) return;
        if (b !== '') { 
            b = b.slice(0, -1);
            updateOutput(a + ' ' + selectedOperation + ' ' + b || a || '0');
        } else if (selectedOperation) { 
            selectedOperation = null;
            updateOutput(a || '0');
        } else {
            a = a.slice(0, -1);
            updateOutput(a || '0');
        }
    }

    document.getElementById("btn_op_sqrt").onclick = function() {
        if (checkInfinity()) return;
        if (!selectedOperation && a !== '') {
            a = Math.sqrt(+a).toString();
            updateOutput(a);
        } else if (b !== '') {
            b = Math.sqrt(+b).toString();
            expressionString = a + ' ' + selectedOperation + ' ' + b;
            updateOutput(expressionString);
        }
    }

    document.getElementById("btn_op_square").onclick = function() {
        if (checkInfinity()) return;
        if (!selectedOperation && a !== '') {
            a = Math.pow(+a, 2).toString();
            updateOutput(a);
        } else if (b !== '') {
            b = Math.pow(+b, 2).toString();
            expressionString = a + ' ' + selectedOperation + ' ' + b;
            updateOutput(expressionString);
        }
    }

    document.getElementById("btn_op_fact").onclick = function() {
        function factorial(n) {
            if (n >= 171) {
                return Infinity;
            }
            return (n != 1 && n != 0) ? n * factorial(n - 1) : 1;
        }

        if (checkInfinity()) return;
        if (!selectedOperation && a !== '') {
            a = factorial(+a).toString();
            updateOutput(a);
        } else if (b !== '') {
            b = factorial(+b).toString();
            expressionString = a + ' ' + selectedOperation + ' ' + b;
            updateOutput(expressionString);
        }
    };

    document.getElementById("btn_op_triple_zero").onclick = function() {
        if (checkInfinity()) return;
        if (!selectedOperation) {
            a += '000';
            updateOutput(a || '0');
        } else {
            b += '000';
            expressionString = a + ' ' + selectedOperation + ' ' + b;
            updateOutput(expressionString);
        }
    };
};
