document.addEventListener(
    "click",
    event => {

        const mapButton =
            event.target.closest(
                "[data-open-map]"
            );


        if (mapButton) {

            event.preventDefault();

            const card =
                mapButton.closest(
                    ".platform-result-card"
                );


            if (card) {
                openMapForElement(card);
            }

            return;
        }


        const card =
            event.target.closest(
                ".platform-result-card"
            );


        if (!card) {
            return;
        }


        /*
         * Don't intercept a nested
         * button/link.
         */
        if (
            event.target.closest(
                "button, a"
            )
        ) {
            return;
        }


        openMapForElement(card);
    }
);
