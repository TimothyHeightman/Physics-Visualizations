/**
 * Checks if n is a number or not.
 * @param n: Input
 * @returns {boolean}
 */
var isNumber = function (n) {
    return isFinite(n) && +n === n;
};

/**
 * Lennard-Jones potential class. If sigma2 and epsilon2 not provided, assuming atom 1 and atom 2 are identical.
 * @param sigma: Separation where potential is 0 for a1-a1 diatom.
 * @param epsilon: Potential at equilibrium distance for a1-a1 diatom.
 * @param sigma2: LJ param sigma for a2-a2 diatom.
 * @param epsilon2: Lj param epsilon for a2-a2 diatom.
 * @constructor
 */
LJ = function (sigma, epsilon, sigma2, epsilon2) {

    // Sanity check.
    if (!isNumber(sigma) || !isNumber(epsilon)) {
        console.error("Error! Sigma and Epsilon values invalid!");
    }
    // LJ parameters initialisation for Atom 1.
    var s1 = sigma;
    var e1 = epsilon;

    var s2, e2;

    // Heterogeneous diatomic molecule.
    if (isNumber(sigma2) && isNumber(epsilon2)){
        // LJ parameters for Atom 2.
        s2 = sigma2;
        e2 = epsilon2;
    }

    else {
        s2 = s1;
        e2 = e1;
    }

    // Calculating combined LJ parameters.
    this.s = (s1 + s2) / 2;
    this.e = Math.sqrt(e1 * e2);
};

/**
 * Calculate LJ potential.
 * @param r: Distance from LJ centre.
 * @returns {number|*}
 */
LJ.prototype.calcV = function(r) {
    var repulsive = Math.pow(this.s / r, 12);                   // Repulsive factors.
    var attractive = -1 * Math.pow(this.s / r, 6);              // Attractive factors.
    return 4 * this.e * (repulsive + attractive);     // Calculating LJ potential at distance r.
};

LJ.prototype.calcF = function(r) {
    var repulsive = 12 * Math.pow(this.s / r, 12);
    var attractive = -6 * Math.pow(this.s / r, 6);
    return 4 * this.e * ((repulsive + attractive) / r);
};

LJ.prototype.getR_0 = function(){
    return Math.pow(2, 1/6) * this.s;
};

LJ.prototype.plotPoints = function(ppu) {
    var r = [];
    var v = [];
    for (var i = 1; i < Math.ceil(this.s * 3 * ppu); i++) {
        r.push(i / ppu);
        v.push(this.calcV(i / ppu));
    }
    return {x: r, y: v, name: "LJ potential", mode: "lines", line: {width: 1, opacity: 0.8, color: "#003E74"}}
};