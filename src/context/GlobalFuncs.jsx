export const calcEuclideanDist = (obj1, obj2) => {
    if (!obj1 || !obj2 || obj1.coordinate_x === undefined || obj1.coordinate_y === undefined || obj2.coordinate_x === undefined || obj2.coordinate_y === undefined) {
        console.error("Invalid objects passed to calcEuclideanDist:", obj1, obj2);
        return Infinity;
    }

    const x1 = obj1.coordinate_x;
    const y1 = obj1.coordinate_y;
    const x2 = obj2.coordinate_x;
    const y2 = obj2.coordinate_y;

    console.log(`Calculating distance between (${x1}, ${y1}) and (${x2}, ${y2})`);
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
