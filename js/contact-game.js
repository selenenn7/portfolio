(function () {
    'use strict';
    const root = document.getElementById('portfolio-garden');
    if (!root) return;
    const get = name => root.querySelector('#garden-' + name);
    const canvas = get('canvas');
    const ctx = canvas.getContext('2d');
    const places = [
        { id: '01', x: 80, y: 78, name: 'CULTI', description: '영화·공연·전시를 함께 즐길 사람을 찾고 예매까지. 취향으로 사람을 연결하는 서비스예요.' },
        { id: '02', x: 240, y: 78, name: '오롯이케이크', description: '상상한 케이크를 3D로 먼저 만나보세요. 디자인을 미리 볼 수 있는 주문 제작 케이크 사이트예요.' },
        { id: '03', x: 80, y: 170, name: '북플립', description: '다음에 읽을 책을 만나는 공간. 도서를 둘러보고 구매하는 웹사이트를 만들었어요.' },
        { id: '04', x: 240, y: 170, name: 'Encyclopedia', description: '물속의 다양한 친구들을 알아가는 물고기 도감. 자연을 웹 안에서 만나는 프로젝트예요.' }
    ];
    let player = { x: 160, y: 199 }, selected = 1, visited = new Set(), lastNear = -1;
    const rect = (x,y,w,h,c) => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); };
    function tree(x,y,pink) {
        rect(x-2,y+8,4,11,'#a69180');
        rect(x-12,y-5,24,15,pink?'#e8b9cd':'#a9c99b');
        rect(x-8,y-12,16,25,pink?'#efc9dc':'#bad5a8');
        rect(x-4,y-15,8,4,pink?'#f4d5e3':'#cce1b9');
        rect(x+7,y+2,5,8,pink?'#dba8c2':'#99bb8f');
    }
    function flower(x,y,c) {
        rect(x,y,1,5,'#9cbb8c'); rect(x-2,y-2,5,3,c); rect(x-1,y-3,3,5,c); rect(x,y-1,1,1,'#fff7ca');
    }
    function house(x,y,roof,wall) {
        rect(x-29,y+27,60,5,'#b9cba8');
        rect(x-25,y,50,29,wall);
        rect(x-31,y-5,62,7,roof); rect(x-26,y-11,52,7,roof); rect(x-20,y-17,40,7,roof);
        rect(x-6,y+11,12,18,'#9e879e'); rect(x-4,y+13,8,16,'#c4a9bb');
        rect(x+2,y+20,2,2,'#f9e8b6');
        [-19,12].forEach(dx=>{rect(x+dx,y+7,9,10,'#afc9d0');rect(x+dx+1,y+8,3,3,'#e1eff0');rect(x+dx-1,y+17,11,2,'#c3a9a0');});
    }
    function draw() {
        ctx.clearRect(0,0,320,224);
        rect(0,0,320,224,'#dfecd3');
        for(let y=7;y<224;y+=16) for(let x=7;x<320;x+=19) {
            rect(x+(y%3),y,2,1,'#cadfbd'); rect(x+3,y-1,1,2,'#d1e3c2');
        }
        rect(148,15,24,198,'#f6edd9');
        rect(65,84,190,22,'#f6edd9'); rect(65,178,190,20,'#f6edd9');
        rect(70,73,20,120,'#f6edd9');rect(230,73,20,120,'#f6edd9');
        for(let y=25;y<210;y+=16) rect(155+(y%3)*3,y,5,2,'#eadfc8');
        // Tiny picket fence and flowering trees.
        rect(9,13,302,3,'#f7f3e8');
        for(let x=10;x<315;x+=12) rect(x,8,3,13,'#fffaf0');
        [[22,43],[296,44],[24,120],[297,119],[22,195],[297,194],[121,134],[198,136]].forEach((p,i)=>tree(...p,i%3===0));
        [[42,77],[119,72],[195,74],[278,78],[39,163],[118,195],[203,195],[274,165],[136,32],[181,48],[136,211],[184,210]].forEach((p,i)=>flower(...p,['#e5b3d1','#fff8e9','#d0b9e3'][i%3]));
        // Cinema: lavender roof and a small film screen.
        house(80,46,'#a99ac9','#faf1e5');
        rect(65,28,30,14,'#796b99');rect(68,30,24,10,'#e9dff5');
        rect(78,32,3,6,'#b3a1cc');rect(81,33,2,4,'#b3a1cc');rect(83,34,2,2,'#b3a1cc');
        // Bakery: strawberry awning and a cake on the roof.
        house(240,46,'#daa6bb','#fff0df');
        for(let x=213;x<268;x+=10) rect(x,45,5,7,'#fff4e7');
        rect(232,25,16,8,'#fff9ed');rect(232,29,16,2,'#dfb3bd');rect(230,33,20,2,'#b99ac2');
        [234,240,246].forEach(x=>rect(x,23,3,3,'#c97c99'));
        // Bookshop: mint roof, colorful books.
        house(80,139,'#91b9ad','#f7ecdc');
        rect(66,121,28,12,'#fdf8ec');
        ['#c29ac2','#d6b17f','#9ab8cc','#aab989'].forEach((c,i)=>rect(69+i*5,124-(i%2),4,7+(i%2),c));
        // Pond: stepped pixel edges, lilies and fish.
        rect(210,135,60,27,'#c0d6b1');rect(216,129,48,39,'#c0d6b1');
        rect(215,137,50,21,'#9ecbd4');rect(221,133,38,29,'#a9d7db');
        rect(224,138,18,2,'#d5eef0');rect(243,154,12,2,'#d5eef0');
        rect(251,139,8,4,'#86b497');rect(254,137,3,3,'#efc1d6');
        rect(224,152,7,4,'#8dbd9b');rect(234,147,7,3,'#edbd91');rect(232,146,2,5,'#edbd91');
        // Benches by the central path.
        [112,190].forEach(x=>{rect(x,107,18,5,'#c7af98');rect(x,114,18,3,'#bba28d');rect(x+2,117,2,4,'#aa9588');rect(x+14,117,2,4,'#aa9588');});
        visited.forEach(i=>{
            const p=places[i];rect(p.x+23,p.y-10,9,9,'#fff5de');
            rect(p.x+25,p.y-6,2,2,'#aa80b9');rect(p.x+27,p.y-8,2,4,'#aa80b9');
        });
        // The visitor, drawn on whole pixels with a purple beret.
        const x=player.x,y=player.y;
        rect(x-6,y+7,12,3,'#bbcaac');rect(x-4,y+4,3,5,'#8b789d');rect(x+1,y+4,3,5,'#8b789d');
        rect(x-5,y-3,10,8,'#b29acb');rect(x-7,y-1,2,5,'#f1cfbb');rect(x+5,y-1,2,5,'#f1cfbb');
        rect(x-4,y-10,8,8,'#f5d7c2');rect(x-5,y-11,10,3,'#7c668c');
        rect(x-7,y-13,14,4,'#a48abd');rect(x-5,y-16,10,4,'#b8a0ce');rect(x+1,y-18,3,3,'#9478ae');
        rect(x-2,y-7,1,2,'#715d77');rect(x+2,y-7,1,2,'#715d77');rect(x-1,y-3,3,1,'#d6a7ac');
    }
    let effectTimers = [];
    function later(fn, delay) {
        const timer = setTimeout(() => {
            effectTimers = effectTimers.filter(id => id !== timer);
            fn();
        }, delay);
        effectTimers.push(timer);
    }
    function clearEffects() {
        effectTimers.forEach(clearTimeout);
        effectTimers = [];
        get('effects').replaceChildren();
        get('arrival').classList.remove('active');
        get('celebration').classList.remove('active');
    }
    function arrivalEffect(index, fresh, complete) {
        clearEffects();
        const p = places[index];
        const palette = ['#fff3a6', '#c898e5', '#f5a7c6', '#ffffff', '#a0d8c8'];
        const layer = get('effects');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function particle(className, x, y, i) {
            const part = document.createElement('span');
            part.className = className;
            part.textContent = className === 'garden-petal' ? ['✿','✦','♥'][i % 3] : '✦';
            part.style.setProperty('--x', x + '%');
            part.style.setProperty('--y', y + '%');
            part.style.setProperty('--color', palette[i % palette.length]);
            part.style.setProperty('--size', (14 + (i % 4) * 5) + 'px');
            part.style.setProperty('--dx', (Math.cos(i * 2.4) * (60 + i % 5 * 17)) + 'px');
            part.style.setProperty('--dy', (Math.sin(i * 2.4) * 90 - 35) + 'px');
            part.style.setProperty('--delay', (i % 13 * .07) + 's');
            layer.appendChild(part);
        }
        if (!reduceMotion) {
            for (let i = 0; i < 22; i++) particle('garden-spark', p.x / 320 * 100, (p.y - 20) / 224 * 100, i);
            const ring = document.createElement('span');
            ring.className = 'garden-ring';
            ring.style.setProperty('--x', p.x / 320 * 100 + '%');
            ring.style.setProperty('--y', (p.y - 20) / 224 * 100 + '%');
            layer.appendChild(ring);
        }
        if (complete) {
            root.classList.add('all-found');
            get('celebration').classList.add('active');
            if (!reduceMotion) for (let i = 0; i < 65; i++) particle('garden-petal', (i * 37) % 100, 0, i);
        } else {
            get('arrival').textContent = (fresh ? '✦ 새로운 발견! ' : '♥ 다시 반가워요! ') + p.name;
            void get('arrival').offsetWidth;
            get('arrival').classList.add('active');
        }
        later(clearEffects, complete ? 9100 : 2100);
    }
    function visit(i, teleport) {
        selected=i;
        const p=places[i];
        if(teleport) player={x:p.x,y:p.y+5};
        const fresh=!visited.has(i);
        visited.add(i);
        get('preview').src='images/project_'+p.id+'.png';
        get('preview').alt=p.name+' 프로젝트 미리보기';
        get('name').textContent=p.name;
        get('description').textContent=p.description;
        get('project').textContent=p.name+' 자세히 보기 ↗';
        get('count').textContent='발견 '+visited.size+' / 4';
        const button=root.querySelector('[data-place="'+i+'"]');
        button.classList.add('visited');button.querySelector('span').textContent='♥';
        get('finish').hidden=visited.size!==4;
        lastNear=i;
        draw();
        arrivalEffect(i, fresh, fresh && visited.size === 4);
    }
    function move(direction) {
        const delta={up:[0,-8],down:[0,8],left:[-8,0],right:[8,0]}[direction];
        if(!delta) return;
        player.x=Math.max(12,Math.min(308,player.x+delta[0]));
        player.y=Math.max(28,Math.min(210,player.y+delta[1]));
        const near=places.findIndex(p=>Math.hypot(player.x-p.x,player.y-p.y)<24);
        if(near!==-1 && near!==lastNear) visit(near,false);
        else { if(near===-1) lastNear=-1;draw(); }
    }
    root.addEventListener('click',event=>{
        const b=event.target.closest('button');
        if(!b) return;
        if(b.dataset.place!==undefined) visit(Number(b.dataset.place),true);
        if(b.dataset.move) move(b.dataset.move);
        if(b.id==='garden-project') {
            const card=document.querySelector('.project-card[data-project="'+places[selected].id+'"]');
            if(card) card.click();
        }
        if(b.id==='garden-reset') {
            clearEffects();root.classList.remove('all-found');
            visited.clear();player={x:160,y:199};lastNear=-1;selected=1;
            root.querySelectorAll('[data-place]').forEach(place=>{place.classList.remove('visited');place.querySelector('span').textContent='♡';});
            get('count').textContent='발견 0 / 4';get('finish').hidden=true;
            get('name').textContent='다시, 느긋하게 산책해 볼까요?';
            get('description').textContent='장소를 톡 누르거나 방향키로 움직이며 네 가지 작업을 만나보세요.';
            get('preview').src='images/project_02.png';get('preview').alt='오롯이케이크 프로젝트 미리보기';
            get('project').textContent='오롯이케이크 구경하기 ↗';
            draw();
        }
    });
    // Arrow keys apply only when focus is inside the game, not while scrolling the site.
    root.addEventListener('keydown',event=>{
        const direction={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[event.key];
        if(direction){event.preventDefault();move(direction);}
    });
    draw();
})();