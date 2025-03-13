pragma circom 2.1.2;

include "../lib/secp256k1/mul.circom";

template VerifyPrivateTransfer() {
    signal input balance;
    signal input amount;
    signal input privateKey;
    signal input pa[2];
    signal input caAmountK;
    signal input c1ayAmount;
    signal input c2ayAmount;
    signal input c1balance[2];
    signal input c2balance[2];

    signal output isVerified;

    // check C1_ay_amount and C2_ay_amount
    component check1 = CheckEncryptResult();
    check1.p <== pa;
    check1.vk <== caAmountK;
    check1.m <== amount;
    check1.c1y <== c1ayAmount;
    check1.c2y <== c2ayAmount;

    // check balance must greater or equal than amount
    component check2 = GreaterEqThan(32);
    check2.in[0] <== balance;
    check2.in[1] <== amount;

    component check3 = CheckBalanceMatch();
    check3.balance <== balance;
    check3.privateKey <== privateKey;
    check3.c1Balance <== c1balance;
    check3.c2Balance <== c2balance;

    component tmpEq = IsEqual();
    tmpEq.in[0] <== check1.isEqual;
    tmpEq.in[1] <==  check2.out;

    component res = IsEqual();
    res.in[0] <== tmpEq.out;
    res.in[1] <== check3.isMatch;

    isVerified <== res.out;
}

template CheckEncryptResult() {
    signal input p[2];
    signal input vk;
    signal input m;
    signal input c1y;
    signal input c2y;

    signal output isEqual;

    component enc = Secp256k1Encrypt();
    enc.p <== p;
    enc.vk <== vk;
    enc.m <== m;

    component tmp1 = parallel BatchEqual();
    tmp1.a <== enc.c1[1];
    tmp1.b <== c1y;
    
    component tmp2 = parallel BatchEqual();
    tmp2.a <== enc.c2[1];
    tmp2.b <== c2y;

    component res = IsEqual();
    res.in[0] <== tmp1.equal;
    res.in[1] <== tmp2.equal;
    isEqual <== res.out;
}

template BatchEqual() {
    signal input a;
    signal input b;
    signal output equal;

    component eq = IsEqual();
    eq.in[0] <== a;
    eq.in[1] <== b;

    equal <== eq.out;
}

template CheckBalance() {
    signal input balance;
    signal input amount;
    signal output isSufficient;

    component gte = GreaterEqThan(32);

    gte.in[0] <== balance;
    gte.in[1] <== amount;
    gte.out ==> isSufficient;
}

template CheckBalanceMatch() {
    signal input balance;
    signal input privateKey;
    signal input c1Balance[2];
    signal input c2Balance[2];

    signal output isMatch;
    var gx = 55066263022277343669578718895168534326250603453777594175500187360389116729240;
    var gy = 32670510020758816978083085130507043184471273380659243275938904335757337482424;

    // compute balance * G
    component mult1 = Secp256k1Mul();
    mult1.scalar <== balance;
    mult1.xP <== gx;
    mult1.yP <== gy;

    // compute privateKey * c1
    component mult2 = Secp256k1Mul();
    mult2.scalar <== privateKey;
    mult2.xP <== c1Balance[0];
    mult2.yP <== c1Balance[1];

    component adder = Secp256k1AddIncomplete();
    adder.xP <== mult1.outX;
    adder.yP <== mult1.outY;
    adder.xQ <== mult2.outX;
    adder.yQ <== mult2.outY;

    component tmp1 = BatchEqual();
    tmp1.a <== adder.outX;
    tmp1.b <== c2Balance[0];
    
    component tmp2 = BatchEqual();
    tmp2.a <== adder.outY;
    tmp2.b <== c2Balance[1];

    component res = IsEqual();
    res.in[0] <== tmp1.equal;
    res.in[1] <== tmp2.equal;
    isMatch <== res.out;
}

template Secp256k1Encrypt() {
    signal input p[2];
    signal input vk;
    signal input m;

    signal output c1[2];
    signal output c2[2];

    var gx = 55066263022277343669578718895168534326250603453777594175500187360389116729240;
    var gy = 32670510020758816978083085130507043184471273380659243275938904335757337482424;

    // c_1 = kG
    component mult1 = Secp256k1Mul();
    mult1.scalar <== vk;
    mult1.xP <== gx;
    mult1.yP <== gy;
    c1[0] <== mult1.outX;
    c1[1] <== mult1.outY;

    // M = mG
    component mult2 = Secp256k1Mul();
    mult2.scalar <== m;
    mult2.xP <== gx;
    mult2.yP <== gy;

    // kP
    component mult3 = Secp256k1Mul();
    mult3.scalar <== vk;
    mult3.xP <== p[0];
    mult3.yP <== p[1];

    // c_2 = M + kP
    component adder = Secp256k1AddIncomplete();
    adder.xP <== mult2.outX;
    adder.yP <== mult2.outY;
    adder.xQ <== mult3.outX;
    adder.yQ <== mult3.outY;

    c2[0] <== adder.outX;
    c2[1] <== adder.outY;
}

component main { public [c1ayAmount,c2ayAmount, c1balance, c2balance] } = VerifyPrivateTransfer();
