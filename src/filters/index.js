export default {
    install: function(Vue, opt) {
        Vue.filter("thousands", this.thousands);
    },

    thousands: function(value) {
        return value.toLocaleString();
    }
}