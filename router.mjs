export function map(app, a, route) {
    route = route || '';
    for (var key in a) {
        switch (typeof a[key]) {
            // { '/path': { ... }}
            case 'object':
                map(app, a[key], route + key);
                break;
            // get: function(){ ... }
            case 'function':
                app[key](route, a[key]);
                break;
        }
    }
}
