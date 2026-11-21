window.addEventListener(
    "load",
    function () {


        /* ==================================================
           ELEMENTS
        ================================================== */

        const objectArea =
            document.querySelector(
                ".object-area"
            );


        const objects =
            document.querySelectorAll(
                ".floating-object"
            );


        const archiveBox =
            document.querySelector(
                ".archive-box"
            );


        const archiveCount =
            document.querySelector(
                "#archive-count"
            );


        const archiveTotal =
            document.querySelector(
                "#archive-total"
            );



        const completionOverlay =
            document.querySelector(
                "#completion-overlay"
            );

        const archiveHint =
            document.querySelector(
                "#archive-hint"
            );

        /* ==================================================
           DATA
        ================================================== */

        const objectData =
            new Map();


        let archivedCount = 0;


        archiveTotal.textContent =
            objects.length;

        showArchiveHint();



        /* ==================================================
           FIRST-VISIT ARCHIVE HINT
        ================================================== */

        function showArchiveHint() {


            archiveHint.classList.add(
                "visible"
            );

        }

        /* ==================================================
           INITIAL POSITIONS
        ================================================== */

        const initialPositionPercent = [

            /* cupcake */

            {
                x: 23,
                y: 27
            },


            /* room */

            {
                x: 56,
                y: 41
            },


            /* cake */

            {
                x: 31,
                y: 62
            }

        ];



        /* ==================================================
           INITIALIZE
        ================================================== */

        objects.forEach(
            function (object, index) {


                const width =
                    object.offsetWidth;


                const height =
                    object.offsetHeight;


                const areaWidth =
                    objectArea.clientWidth;


                const areaHeight =
                    objectArea.clientHeight;


                const initial =
                    initialPositionPercent[index]
                    ||
                    {
                        x: 40,
                        y: 40
                    };


                const startX =

                    areaWidth *
                    (
                        initial.x / 100
                    );


                const startY =

                    areaHeight *
                    (
                        initial.y / 100
                    );


                /*
                   �ӵ�

                   �������� ������ ����
                */

                const speed =

                    0.45 +
                    Math.random() *
                    0.45;


                const angle =

                    Math.random() *
                    Math.PI *
                    2;


                const data = {

                    x:
                        startX,

                    y:
                        startY,


                    width:
                        width,

                    height:
                        height,


                    /*
                       ���� �ӵ�
                    */

                    velocityX:

                        Math.cos(angle)
                        *
                        speed,


                    velocityY:

                        Math.sin(angle)
                        *
                        speed,


                    /*
                       ������ ���ϰ� ���� �ӵ�
                    */

                    targetVelocityX:

                        Math.cos(angle)
                        *
                        speed,


                    targetVelocityY:

                        Math.sin(angle)
                        *
                        speed,


                    /*
                       ȸ��
                    */

                    rotation:
                        0,


                    targetRotation:

                        (
                            Math.random()
                            *
                            18
                        )
                        -
                        9,


                    rotationSpeed:

                        0.0025
                        +
                        Math.random()
                        *
                        0.003,


                    /*
                       ������ �ٽ� ������ �ð�
                    */

                    nextDirectionChange:

                        performance.now()
                        +
                        randomBetween(
                            1800,
                            4200
                        ),


                    /*
                       �巡��
                    */

                    dragging:
                        false,

                    archiving:
                        false,


                    pointerOffsetX:
                        0,


                    pointerOffsetY:
                        0

                };


                objectData.set(
                    object,
                    data
                );


                /*
                   �⺻ ������ �̹��� �巡�� ����
                */

                object.ondragstart =
                    function () {

                        return false;

                    };


                applyPosition(
                    object,
                    data
                );



                /* ==========================================
                   POINTER DOWN
                =========================================== */

                object.addEventListener(
                    "pointerdown",
                    function (event) {


                        if (
                            object.classList.contains(
                                "archived"
                            )
                        ) {

                            return;

                        }


                        data.dragging = true;


                        object.classList.add(
                            "dragging"
                        );


                        const rect =

                            object
                            .getBoundingClientRect();


                        data.pointerOffsetX =

                            event.clientX
                            -
                            rect.left;


                        data.pointerOffsetY =

                            event.clientY
                            -
                            rect.top;


                        object.setPointerCapture(
                            event.pointerId
                        );


                        event.preventDefault();


                    }
                );



                /* ==========================================
                   POINTER MOVE
                =========================================== */

                object.addEventListener(
                    "pointermove",
                    function (event) {


                        if (
                            !data.dragging
                        ) {

                            return;

                        }


                        const areaRect =

                            objectArea
                            .getBoundingClientRect();


                        let x =

                            event.clientX
                            -
                            areaRect.left
                            -
                            data.pointerOffsetX;


                        let y =

                            event.clientY
                            -
                            areaRect.top
                            -
                            data.pointerOffsetY;



                        const maxX =

                            objectArea.clientWidth
                            -
                            data.width;


                        const maxY =

                            objectArea.clientHeight
                            -
                            data.height;



                        x = clamp(
                            x,
                            0,
                            maxX
                        );


                        y = clamp(
                            y,
                            0,
                            maxY
                        );


                        data.x = x;

                        data.y = y;


                        applyPosition(
                            object,
                            data
                        );


                        updateArchiveState(
                            object
                        );


                    }
                );



                /* ==========================================
                   POINTER UP
                =========================================== */

                object.addEventListener(
                    "pointerup",
                    function (event) {


                        if (
                            !data.dragging
                        ) {

                            return;

                        }


                        data.dragging = false;


                        object.classList.remove(
                            "dragging"
                        );


                        if (
                            isOverArchive(
                                object
                            )
                        ) {

                            archiveObject(
                                object
                            );

                        }


                        archiveBox
                        .classList
                        .remove(
                            "active"
                        );


                        try {

                            object
                            .releasePointerCapture(
                                event.pointerId
                            );

                        }

                        catch (error) {

                        }


                        /*
                           ����ڰ� ���� ��
                           �ٽ� ���ο� ���� �ο�
                        */

                        setRandomDirection(
                            data
                        );


                    }
                );


            }
        );



        /* ==================================================
           RANDOM
        ================================================== */

        function randomBetween(
            min,
            max
        ) {

            return (
                Math.random()
                *
                (
                    max - min
                )
            )
            +
            min;

        }



        /* ==================================================
           CLAMP
        ================================================== */

        function clamp(
            value,
            min,
            max
        ) {

            return Math.max(
                min,
                Math.min(
                    value,
                    max
                )
            );

        }



        /* ==================================================
           RANDOM DIRECTION
        ================================================== */

        function setRandomDirection(
            data
        ) {


            const angle =

                Math.random()
                *
                Math.PI
                *
                2;


            const speed =

                randomBetween(
                    0.45,
                    0.9
                );


            data.targetVelocityX =

                Math.cos(angle)
                *
                speed;


            data.targetVelocityY =

                Math.sin(angle)
                *
                speed;



            /*
               ȸ�� ��ǥ�� ���� ����
            */

            data.targetRotation =

                randomBetween(
                    -13,
                    13
                );


            data.rotationSpeed =

                randomBetween(
                    0.0015,
                    0.004
                );


            data.nextDirectionChange =

                performance.now()
                +
                randomBetween(
                    1800,
                    4500
                );

        }



        /* ==================================================
           APPLY POSITION
        ================================================== */

        function applyPosition(
            object,
            data
        ) {


            object.style.left =
                data.x
                +
                "px";


            object.style.top =
                data.y
                +
                "px";


            object.style.transform =

                "rotate("
                +
                data.rotation
                +
                "deg)";

        }



        /* ==================================================
           KEEP INSIDE AREA
        ================================================== */

        function keepInside(
            data
        ) {


            const maxX =

                objectArea.clientWidth
                -
                data.width;


            const maxY =

                objectArea.clientHeight
                -
                data.height;



            if (
                data.x <= 0
            ) {

                data.x = 0;


                data.velocityX =

                    Math.abs(
                        data.velocityX
                    );


                data.targetVelocityX =

                    Math.abs(
                        data.targetVelocityX
                    );

            }



            if (
                data.x >= maxX
            ) {

                data.x =
                    maxX;


                data.velocityX =

                    -Math.abs(
                        data.velocityX
                    );


                data.targetVelocityX =

                    -Math.abs(
                        data.targetVelocityX
                    );

            }



            if (
                data.y <= 105
            ) {

                data.y =
                    105;


                data.velocityY =

                    Math.abs(
                        data.velocityY
                    );


                data.targetVelocityY =

                    Math.abs(
                        data.targetVelocityY
                    );

            }



            if (
                data.y >= maxY
            ) {

                data.y =
                    maxY;


                data.velocityY =

                    -Math.abs(
                        data.velocityY
                    );


                data.targetVelocityY =

                    -Math.abs(
                        data.targetVelocityY
                    );

            }

        }



        /* ==================================================
           ANIMATION
        ================================================== */

        function animate(
            currentTime
        ) {


            objectData.forEach(
                function (
                    data,
                    object
                ) {


                    if (
                        object
                        .classList
                        .contains(
                            "archived"
                        )
                    ) {

                        return;

                    }



                    if (
                        data.dragging
                        ||
                        data.archiving
                    ) {

                        return;

                    }



                    /*
                       ���� �ð��� ������
                       ���ο� ���� ���� ����
                    */

                    if (
                        currentTime
                        >
                        data.nextDirectionChange
                    ) {

                        setRandomDirection(
                            data
                        );

                    }



                    /*
                       ���� ������
                       ��ǥ �������� õõ�� ����

                       ���ڱ� ������ ���̴� ���� ����
                    */

                    data.velocityX +=

                        (
                            data.targetVelocityX
                            -
                            data.velocityX
                        )
                        *
                        0.008;


                    data.velocityY +=

                        (
                            data.targetVelocityY
                            -
                            data.velocityY
                        )
                        *
                        0.008;



                    /*
                       �̵�
                    */

                    data.x +=

                        data.velocityX;


                    data.y +=

                        data.velocityY;



                    /*
                       ȸ���� ��ǥ ������ õõ�� �̵�
                    */

                    data.rotation +=

                        (
                            data.targetRotation
                            -
                            data.rotation
                        )
                        *
                        data.rotationSpeed;



                    keepInside(
                        data
                    );


                    applyPosition(
                        object,
                        data
                    );


                }
            );


            requestAnimationFrame(
                animate
            );

        }



        /* ==================================================
           ARCHIVE COLLISION
        ================================================== */

        function isOverArchive(
            object
        ) {


            const objectRect =

                object
                .getBoundingClientRect();


            const boxRect =

                archiveBox
                .getBoundingClientRect();



            return (

                objectRect.left
                <
                boxRect.right

                &&

                objectRect.right
                >
                boxRect.left

                &&

                objectRect.top
                <
                boxRect.bottom

                &&

                objectRect.bottom
                >
                boxRect.top

            );

        }



        function updateArchiveState(
            object
        ) {


            if (
                isOverArchive(
                    object
                )
            ) {

                archiveBox
                .classList
                .add(
                    "active"
                );

            }

            else {

                archiveBox
                .classList
                .remove(
                    "active"
                );

            }

        }



        /* ==================================================
           ARCHIVE OBJECT
        ================================================== */

        function archiveObject(
            object
        ) {


            if (
                object.classList.contains(
                    "archived"
                )
                ||
                object.classList.contains(
                    "archiving"
                )
            ) {

                return;

            }


            const data =
                objectData.get(
                    object
                );


            const areaRect =
                objectArea.getBoundingClientRect();


            const boxRect =
                archiveBox.getBoundingClientRect();


            data.archiving = true;


            object.classList.add(
                "archiving"
            );


            /* Start the transition from the current visual position. */
            void object.offsetWidth;


            data.x =
                boxRect.left
                -
                areaRect.left
                +
                (
                    boxRect.width
                    -
                    data.width
                )
                / 2;


            data.y =
                boxRect.top
                -
                areaRect.top
                +
                (
                    boxRect.height
                    -
                    data.height
                )
                / 2;


            object.style.left =
                data.x
                +
                "px";


            object.style.top =
                data.y
                +
                "px";


            object.style.transform =
                "rotate("
                +
                (
                    data.rotation
                    +
                    180
                )
                +
                "deg) scale(0.12)";


            object.style.opacity =
                "0";


            archivedCount++;


            archiveCount.textContent =
                archivedCount;


            playArchiveFeedback();


            window.setTimeout(
                function () {

                    data.archiving = false;


                    object.classList.remove(
                        "archiving"
                    );


                    object.classList.add(
                        "archived"
                    );

                },
                440
            );


            if (
                archivedCount
                ===
                objects.length
            ) {


                document.querySelector(
                    ".archive-title"
                ).textContent =
                    "ARCHIVED";


                document.querySelector(
                    ".archive-label"
                ).textContent =
                    "COMPLETE";

            window.setTimeout(
                showCompletionOverlay,
                460
            );

            }



        }


        /* ==================================================
           ARCHIVE FEEDBACK
        ================================================== */

        function playArchiveFeedback() {


            archiveBox.classList.remove(
                "drop-success"
            );


            archiveCount.classList.remove(
                "count-bump"
            );


            void archiveBox.offsetWidth;


            archiveBox.classList.add(
                "drop-success"
            );


            archiveCount.classList.add(
                "count-bump"
            );


            window.setTimeout(
                function () {

                    archiveBox.classList.remove(
                        "drop-success"
                    );


                    archiveCount.classList.remove(
                        "count-bump"
                    );

                },
                760
            );

        }

        /* ==================================================
           COMPLETION OVERLAY
        ================================================== */

        function showCompletionOverlay() {


            completionOverlay.setAttribute(
                "aria-hidden",
                "false"
            );


            completionOverlay.classList.add(
                "visible"
            );

        }

        /* ==================================================
           RESIZE
        ================================================== */

        window.addEventListener(
            "resize",
            function () {


                objectData.forEach(
                    function (
                        data,
                        object
                    ) {


                        if (
                            object
                            .classList
                            .contains(
                                "archived"
                            )
                        ) {

                            return;

                        }


                        data.width =
                            object.offsetWidth;


                        data.height =
                            object.offsetHeight;


                        keepInside(
                            data
                        );


                        applyPosition(
                            object,
                            data
                        );


                    }
                );


            }
        );



        /* ==================================================
           START
        ================================================== */

        requestAnimationFrame(
            animate
        );


    }
);
/* ==================================================
   INDEX PROJECT SHOWCASE
================================================== */

window.addEventListener(
    "load",
    function initIndexProjectShowcase() {


        const revealItems =
            document.querySelectorAll(
                "#projects .reveal"
            );


        if (
            !revealItems.length
        ) {

            return;

        }


        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            revealItems.forEach(
                function (item) {

                    item.classList.add(
                        "is-visible"
                    );

                }
            );


            return;

        }


        const observer =
            new IntersectionObserver(
                function (
                    entries,
                    currentObserver
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            currentObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealItems.forEach(
            function (item) {

                observer.observe(
                    item
                );

            }
        );

    }
);