jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "numeric-comma-pre": function (a) {
        // prepare number
        a = +(a.replace(",", ""));
        a = (isNaN(a)) ? Number.MAX_VALUE : a;
        return a;
    },
    "numeric-comma-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
    "numeric-comma-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});