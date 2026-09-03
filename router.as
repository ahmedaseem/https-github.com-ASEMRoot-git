document.addEventListener("click", event => {

    const button =
        event.target.closest(
            "[data-search-type]"
        );

    if (!button) {
        return;
    }

    const type =
        button.dataset.searchType;

    ASEM.state.searchType =
        type;

    const input =
        document.getElementById(
            "searchBox"
        );

    if (input) {
        performASEMSearch(
            input.value
        );
    }
});

