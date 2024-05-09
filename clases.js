class Pila {

    constructor() {
        this.Stack = [];
    }

    Push(P) {
        this.Stack.push(P);
    }

    Pop() {
        return (this.Stack.pop());
    }

    Peek() {
        return this.Stack[this.Stack.length - 1];
    }

    Size() {
        return this.Stack.length;
    }

    Print() {
        console.log(this.Stack.toString());
    }
}

class Cola {
    constructor() {
        this.Queue = [];
    }

    Unshift(U) {
        this.Queue.unshift(U);
    }

    Shift() {
        return this.Queue.shift();
    }

    Front() {
        return this.Queue[0];
    }

    Size() {
        return this.Queue.length;
    }

    Print() {
        console.log(this.Queue.toString());
    }
}