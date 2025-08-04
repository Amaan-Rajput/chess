const onload = () => {
    // pick up Element from document
    const Body = document.querySelector('body');
    const Gameboard = document.querySelector('.gameboard');
    const Arrow = document.querySelector('#arrow svg');
    const massage = document.querySelector('.turn p');
    const warning = document.querySelector('.warning');
    const width = 8;

    let playertrun = "black-piece";
    let startPostitonId
    let draggedElement

    // create starting piece position 
    const startpieces = [
        rook, knights, bishops, queen, king, bishops, knights, rook,
        pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
        rook, knights, bishops, queen, king, bishops, knights, rook,
    ]
    // createboard 
    function createboard() {
        startpieces.forEach((startpiece, i) => {
            const box = document.createElement('div');
            box.classList.add('box');
            box.innerHTML = startpiece
            box.firstChild?.setAttribute('draggable', true)
            box.setAttribute('box-id', i);
            Gameboard.appendChild(box)
            // find even and odd Element
            const row = Math.floor((63 - i) / 8) + 1
            // color for odd Element
            if (row % 2 === 0) {
                box.classList.add(i % 2 === 0 ? "black" : "white")
            } else { // color for odd Element
                box.classList.add(i % 2 === 0 ? "white" : "black")
            }
            // create Black piece
            if (i <= 15) {
                box.firstChild.firstChild.classList.add('black-piece')
            }
            // create White piece
            if (i >= 48) {
                box.firstChild.firstChild.classList.add('white-piece')
            }
        })
    }
    createboard();

    const allBoxes = document.querySelectorAll('.box');

    allBoxes.forEach(box => {
        box.addEventListener('dragstart', dragStart)
        box.addEventListener('dragover', dragOver)
        box.addEventListener('drop', dragDrop)
    })

    // pick up Element
    function dragStart(e) {
        startPostitonId = e.target.parentNode.getAttribute('box-id')
        draggedElement = e.target
    }
    // fly Element
    function dragOver(e) {
        e.preventDefault()
    }
    // place Element
    function dragDrop(e) {
        e.stopPropagation()
        const correctGo = draggedElement.firstChild.classList.contains(playertrun)
        const taken = e.target.classList.contains('pieces')
        const valid = checkIfValid(e.target)
        const opponenttrun = playertrun === 'white-piece' ? 'black-piece' : 'white-piece';
        const takenByOpponent = e.target.firstChild?.classList.contains(opponenttrun)

        if (correctGo) {
            if (takenByOpponent && valid) {
                e.target.parentNode.append(draggedElement)
                e.target.remove();
                checkForWin()
                changeplayer();
                return
            }
            if (taken && !takenByOpponent) {
                warning.textContent = 'you cannot go here!';
                setTimeout(() => warning.textContent = "", 3000)
                return
            }
            if (valid) {
                e.target.append(draggedElement)
                checkForWin()
                changeplayer()
                return
            }
        }

    }

    function checkIfValid(target) {
        // get id where place piece
        const targetId = Number(target.getAttribute('box-id')) || Number(target.parentNode.getAttribute('box-id'))
        // get id from where piece 
        const startId = Number(startPostitonId)
        // get id from pickup piece
        const piece = draggedElement.id

        switch (piece) {
            // condition for Pawn piece
            case 'pawn':
                const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
                const lastRow = [56, 57, 58, 59, 60, 61, 62, 63]
                // if pawn first move they can move two width
                // for forward direction
                if (starterRow.includes(startId) && startId + width * 2 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild ||
                    startId + width === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild ||
                    // for kill Element
                    startId + width - 1 === targetId && document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild ||
                    startId + width + 1 === targetId && document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild
                ) {
                    // change pawn to queen 
                    if (lastRow.includes(targetId) && !document.querySelector(`[box-id="${startId + width}"]`).firstChild) {
                        // for White piece
                        if (draggedElement.firstChild.classList.contains('white-piece')) {
                            draggedElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 144C346.5 144 368 122.5 368 96C368 69.5 346.5 48 320 48C293.5 48 272 69.5 272 96C272 122.5 293.5 144 320 144zM69.5 249L192 448L135.8 518.3C130.8 524.6 128 532.4 128 540.5C128 560.1 143.9 576 163.5 576L476.4 576C496 576 511.9 560.1 511.9 540.5C511.9 532.4 509.2 524.6 504.1 518.3L448 448L570.5 249C574.1 243.1 576 236.3 576 229.4L576 228.8C576 208.5 559.5 192 539.2 192C531.9 192 524.8 194.2 518.8 198.2L501.9 209.5C489.2 218 472.3 216.3 461.5 205.5L427.4 171.4C420.1 164.1 410.2 160 400 160C389.8 160 379.9 164.1 372.7 171.3L342.6 201.4C330.1 213.9 309.8 213.9 297.3 201.4L267.2 171.3C260.1 164.1 250.2 160 240 160C229.8 160 219.9 164.1 212.7 171.3L178.6 205.4C167.8 216.2 150.9 217.9 138.2 209.4L121.3 198.2C115.2 194.2 108.1 192 100.9 192C80.6 192 64.1 208.5 64.1 228.8L64.1 229.4C64.1 236.3 66 243.1 69.6 249z"/></svg>`
                            draggedElement.firstChild.classList.add('white-piece');
                        }
                        // for Black piece
                        else if (draggedElement.firstChild.classList.contains('black-piece')) {
                            draggedElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 144C346.5 144 368 122.5 368 96C368 69.5 346.5 48 320 48C293.5 48 272 69.5 272 96C272 122.5 293.5 144 320 144zM69.5 249L192 448L135.8 518.3C130.8 524.6 128 532.4 128 540.5C128 560.1 143.9 576 163.5 576L476.4 576C496 576 511.9 560.1 511.9 540.5C511.9 532.4 509.2 524.6 504.1 518.3L448 448L570.5 249C574.1 243.1 576 236.3 576 229.4L576 228.8C576 208.5 559.5 192 539.2 192C531.9 192 524.8 194.2 518.8 198.2L501.9 209.5C489.2 218 472.3 216.3 461.5 205.5L427.4 171.4C420.1 164.1 410.2 160 400 160C389.8 160 379.9 164.1 372.7 171.3L342.6 201.4C330.1 213.9 309.8 213.9 297.3 201.4L267.2 171.3C260.1 164.1 250.2 160 240 160C229.8 160 219.9 164.1 212.7 171.3L178.6 205.4C167.8 216.2 150.9 217.9 138.2 209.4L121.3 198.2C115.2 194.2 108.1 192 100.9 192C80.6 192 64.1 208.5 64.1 228.8L64.1 229.4C64.1 236.3 66 243.1 69.6 249z"/></svg>`
                            draggedElement.firstChild.classList.add('black-piece');
                        }
                        draggedElement.id = 'queen';
                    }
                    return true;
                }

                break;
                // condition for Knights piece
            case 'knights':
                // for forward direction
                if (startId + width * 2 + 1 === targetId ||
                    startId + width * 2 - 1 === targetId ||
                    startId + width + 2 === targetId ||
                    startId + width - 2 === targetId ||
                    // for backward direction
                    startId - width * 2 + 1 === targetId ||
                    startId - width * 2 - 1 === targetId ||
                    startId - width + 2 === targetId ||
                    startId - width - 2 === targetId
                ) {
                    return true;
                }
                break;
                // condition for Bishops piece
            case 'bishops':
                // for front left direction
                if (startId + width + 1 === targetId ||
                    startId + width * 2 + 2 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild || // "!": if target box or between an Element so return false
                    startId + width * 3 + 3 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild ||
                    startId + width * 4 + 4 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild ||
                    startId + width * 5 + 5 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 + 4}"]`).firstChild ||
                    startId + width * 6 + 6 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 + 5}"]`).firstChild ||
                    startId + width * 7 + 7 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 6 + 6}"]`).firstChild ||
                    // for back right direction
                    startId - width - 1 === targetId ||
                    startId - width * 2 - 2 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild ||
                    startId - width * 3 - 3 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild ||
                    startId - width * 4 - 4 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild ||
                    startId - width * 5 - 5 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 - 4}"]`).firstChild ||
                    startId - width * 6 - 6 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 - 5}"]`).firstChild ||
                    startId - width * 7 - 7 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 6 - 6}"]`).firstChild ||
                    // for front right direction
                    startId + width - 1 === targetId ||
                    startId + width * 2 - 2 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild ||
                    startId + width * 3 - 3 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild ||
                    startId + width * 4 - 4 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild ||
                    startId + width * 5 - 5 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 - 4}"]`).firstChild ||
                    startId + width * 6 - 6 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 - 5}"]`).firstChild ||
                    startId + width * 7 - 7 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 6 - 6}"]`).firstChild ||
                    // for back left direction  
                    startId - width + 1 === targetId ||
                    startId - width * 2 + 2 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild ||
                    startId - width * 3 + 3 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild ||
                    startId - width * 4 + 4 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild ||
                    startId - width * 5 + 5 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 + 4}"]`).firstChild ||
                    startId - width * 6 + 6 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 + 5}"]`).firstChild ||
                    startId - width * 7 + 7 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 6 + 6}"]`).firstChild

                ) {
                    return true
                }
                break;
                // condition for Rook piece
            case 'rook':
                // for front direction 
                if (startId + width === targetId ||
                    startId + width * 2 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild ||
                    startId + width * 3 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild ||
                    startId + width * 4 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild ||
                    startId + width * 5 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4}"]`).firstChild ||
                    startId + width * 6 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5}"]`).firstChild ||
                    startId + width * 7 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 6}"]`).firstChild ||
                    // for back direction
                    startId - width === targetId ||
                    startId - width * 2 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild ||
                    startId - width * 3 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild ||
                    startId - width * 4 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild ||
                    startId - width * 5 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4}"]`).firstChild ||
                    startId - width * 6 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5}"]`).firstChild ||
                    startId - width * 7 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 6}"]`).firstChild ||
                    // for left side direction
                    startId + 1 === targetId ||
                    startId + 2 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild ||
                    startId + 3 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild ||
                    startId + 4 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild ||
                    startId + 5 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + 4}"]`).firstChild ||
                    startId + 6 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + 5}"]`).firstChild ||
                    startId + 7 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + 6}"]`).firstChild ||
                    // for right side direction
                    startId - 1 === targetId ||
                    startId - 2 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild ||
                    startId - 3 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild ||
                    startId - 4 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild ||
                    startId - 5 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - 4}"]`).firstChild ||
                    startId - 6 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - 5}"]`).firstChild ||
                    startId - 7 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - 6}"]`).firstChild
                ) {
                    return true
                }
                break;
                // condition for Queen piece
            case 'queen':
                // for front left direction
                if (startId + width + 1 === targetId ||
                    startId + width * 2 + 2 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild ||
                    startId + width * 3 + 3 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild ||
                    startId + width * 4 + 4 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild ||
                    startId + width * 5 + 5 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 + 4}"]`).firstChild ||
                    startId + width * 6 + 6 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 + 5}"]`).firstChild ||
                    startId + width * 7 + 7 === targetId && !document.querySelector(`[box-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 6 + 6}"]`).firstChild ||
                    // for back right direction
                    startId - width - 1 === targetId ||
                    startId - width * 2 - 2 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild ||
                    startId - width * 3 - 3 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild ||
                    startId - width * 4 - 4 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild ||
                    startId - width * 5 - 5 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 - 4}"]`).firstChild ||
                    startId - width * 6 - 6 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 - 5}"]`).firstChild ||
                    startId - width * 7 - 7 === targetId && !document.querySelector(`[box-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 6 - 6}"]`).firstChild ||
                    // for front right direction
                    startId + width - 1 === targetId ||
                    startId + width * 2 - 2 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild ||
                    startId + width * 3 - 3 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild ||
                    startId + width * 4 - 4 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild ||
                    startId + width * 5 - 5 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 - 4}"]`).firstChild ||
                    startId + width * 6 - 6 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 - 5}"]`).firstChild ||
                    startId + width * 7 - 7 === targetId && !document.querySelector(`[box-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 6 - 6}"]`).firstChild ||
                    // for back left direction 
                    startId - width + 1 === targetId ||
                    startId - width * 2 + 2 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild ||
                    startId - width * 3 + 3 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild ||
                    startId - width * 4 + 4 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild ||
                    startId - width * 5 + 5 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 + 4}"]`).firstChild ||
                    startId - width * 6 + 6 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 + 5}"]`).firstChild ||
                    startId - width * 7 + 7 === targetId && !document.querySelector(`[box-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 6 + 6}"]`).firstChild ||
                    // for front direction
                    startId + width === targetId ||
                    startId + width * 2 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild ||
                    startId + width * 3 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild ||
                    startId + width * 4 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild ||
                    startId + width * 5 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4}"]`).firstChild ||
                    startId + width * 6 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5}"]`).firstChild ||
                    startId + width * 7 === targetId && !document.querySelector(`[box-id="${startId + width}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + width * 6}"]`).firstChild ||
                    // for back direction
                    startId - width === targetId ||
                    startId - width * 2 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild ||
                    startId - width * 3 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild ||
                    startId - width * 4 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild ||
                    startId - width * 5 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4}"]`).firstChild ||
                    startId - width * 6 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5}"]`).firstChild ||
                    startId - width * 7 === targetId && !document.querySelector(`[box-id="${startId - width}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - width * 6}"]`).firstChild ||
                    // for left side direction
                    startId + 1 === targetId ||
                    startId + 2 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild ||
                    startId + 3 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild ||
                    startId + 4 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild ||
                    startId + 5 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + 4}"]`).firstChild ||
                    startId + 6 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + 5}"]`).firstChild ||
                    startId + 7 === targetId && !document.querySelector(`[box-id="${startId + 1}"]`).firstChild && !document.querySelector(`[box-id="${startId + 2}"]`).firstChild && !document.querySelector(`[box-id="${startId + 3}"]`).firstChild && !document.querySelector(`[box-id="${startId + 4}"]`).firstChild && !document.querySelector(`[box-id="${startId + 5}"]`).firstChild && !document.querySelector(`[box-id="${startId + 6}"]`).firstChild ||
                    // for right side direction
                    startId - 1 === targetId ||
                    startId - 2 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild ||
                    startId - 3 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild ||
                    startId - 4 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild ||
                    startId - 5 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - 4}"]`).firstChild ||
                    startId - 6 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - 5}"]`).firstChild ||
                    startId - 7 === targetId && !document.querySelector(`[box-id="${startId - 1}"]`).firstChild && !document.querySelector(`[box-id="${startId - 2}"]`).firstChild && !document.querySelector(`[box-id="${startId - 3}"]`).firstChild && !document.querySelector(`[box-id="${startId - 4}"]`).firstChild && !document.querySelector(`[box-id="${startId - 5}"]`).firstChild && !document.querySelector(`[box-id="${startId - 6}"]`).firstChild
                ) {
                    return true
                }
                break;
                // condition for King piece
            case 'king':
                // go all direction 
                if (startId + width === targetId || 
                    startId - width === targetId ||
                    startId + 1 === targetId ||
                    startId - 1 === targetId ||
                    startId + width + 1 === targetId ||
                    startId + width - 1 === targetId ||
                    startId - width + 1 === targetId ||
                    startId - width - 1 === targetId
                ) {
                    return true
                }

        }
    }
    // changeplayer trun 
    function changeplayer() {
        if (playertrun === "black-piece") {
            reverseIds()
            playertrun = "white-piece";
            massage.textContent = "it is white's go";
            Arrow.style.rotate = "180deg";
        } else {
            revertIds()
            playertrun = "black-piece";
            massage.textContent = "it is black's go";
            Arrow.style.rotate = "0deg";
        }
    }
    // change id's 0-63
    function reverseIds() {
        const allBoxes = document.querySelectorAll('.box');
        allBoxes.forEach((box, i) =>
            box.setAttribute('box-id', (width * width - 1) - i))
    }
    // change id's 63-0
    function revertIds() {
        const allBoxes = document.querySelectorAll('.box');
        allBoxes.forEach((box, i) => box.setAttribute('box-id', i))
    }
    // if king is kill 
    function checkForWin() {
        const kings = Array.from(document.querySelectorAll('#king'))
        if (!kings.some(king => king.firstChild.classList.contains('white-piece'))) {
            const allBoxes = document.querySelectorAll('.box')
            allBoxes.forEach(box => box.firstChild?.setAttribute('draggable', false))
            winboard("Black")
        }
        if (!kings.some(king => king.firstChild.classList.contains('black-piece'))) {
            const allBoxes = document.querySelectorAll('.box')
            allBoxes.forEach(box => box.firstChild?.setAttribute('draggable', false))
            winboard("White")
        }
    }
    // winnerboard active 
    function winboard(e) {
        const winnerboard = document.createElement('div')
        winnerboard.classList.add('winnerboard');
        winnerboard.innerHTML = `<div class="winner">${e} winner</div>
                    <button type="button" class="btn">New Game</button>`;
        Body.appendChild(winnerboard);
        const restartBtn = winnerboard.querySelector('.btn');
        restartBtn.addEventListener('click', gameRestart)
    }
    // game restart 
    function gameRestart() {
        const winnerboard = document.querySelector('.winnerboard')
        Gameboard.innerHTML = "";
        Arrow.style.rotate = "0deg";
        massage.textContent = "it is black's go";
        Body.removeChild(winnerboard)
        onload()
    }
}
// window load 
window.addEventListener('load', () => {
    onload();
})