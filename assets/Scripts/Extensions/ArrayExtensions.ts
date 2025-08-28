
export { };

declare global {
    interface Array<T> {
        removeIf(callback: (value: T, index: number) => boolean);
        contains(value: T): boolean;
        remove(value: T);
        Shuffle();
    }
}

((proto) => {
    proto.removeIf = function (callback) {
        var i = this.length;
        while (i--) {
            if (callback(this[i], i)) {
                this.splice(i, 1);
            }
        }
    }

    proto.contains = function (value: any) {
        return this.indexOf(value) > -1;
    }

    proto.remove = function (value: any) {
        const index = this.indexOf(value);
        if (index < 0) return;
        this.splice(index, 1);
    }

    proto.Shuffle = function() {
        let currentIndex = this.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [this[currentIndex], this[randomIndex]] = [
                this[randomIndex], this[currentIndex]];
        }

        return this;
    }
})(Array.prototype);