var chatScroll = function () {
    if($('.uk-panel-scrollable').length > 0){
        setTimeout(function () {
            var elm = $('.uk-panel-scrollable');
            elm.scrollTop(elm.get(0).scrollHeight);
        }, 10);
    }
};
var getChatRoom =  function (self) {
    $.ajax({
        url:'getMessages.php',
        type:'POST',
        success: function(data){
            var chatMessageCountOld = self.chatRoom.length;
            self.chatRoom = [];
            var result = JSON.parse(data);
            result.forEach(function (item) {
                if(item){
                    self.chatRoom.push(item);
                }
            });
            var chatMessageCountNew = self.chatRoom.length;
            if(chatMessageCountOld < chatMessageCountNew){
                chatScroll();
            }
        },
        error: function (e) {

        }
    });
};
var sendChatMessage =  function (m, s) {
    var messageBody = {
        text: m,
        userId: s.user.userId,
        userName: s.user.name
    };

    var jsonData = JSON.stringify(messageBody);
    var sendjson = 'jsonData='+ jsonData;
    $.ajax({
        url:'addMessage.php',
        type:'POST',
        data: sendjson,
        success: function(data){
            //console.log(data)
        }
    });
};

var app = new Vue ({
    el:'#app',
    data:{
        spinnerOn: false,
        login: {
            name: '',
            password: ''
        },
        user:{
            name: '',
            userId: '',
        },
        users: [
            {
                name: 'user 1',
            },
            {
                name: 'user 2',
            },
            {
                name: 'user 3',
            },
            {
                name: 'user 4',
            },
            {
                name: 'user 5',
            },
        ],
        chatRoom: [],
        currentMessage: '',
        sign: {
            isLogin: false,
        },
    },
    mounted: function () {
        var self = this;
        getChatRoom(self);
    },
    methods:{
        removeMessage: function (elem) {
            var self = this;
            self.chatRoom.splice(self.chatRoom.indexOf(elem), 1);
        },
        sendMessage:function (e, message) {
            var self = this;
            var form = e.target;
            var jForm = $(e.target);
            var requared = true;
            var inputs = jForm.find('[data-required]');

            for(var i = 0; i < inputs.length; i++){
                if(inputs.eq(i).val() == '') {
                    requared = false;
                }
            }

            if(requared){
                self.currentMessage = '';
                form.reset();
                self.spinnerOn = true;
                UIkit.notification($(e.target).data(), {pos: 'top-center'});
                chatScroll();
                setTimeout(function () {
                    sendChatMessage(message, self);
                    getChatRoom(self);
                    self.spinnerOn = false;
                }, 800)
            }
            else{
                for(var i = 0; i < inputs.length; i++){
                    if(inputs.eq(i).val() == '') {
                        inputs.eq(i).addClass('input_error');
                        setTimeout(function () {
                            inputs.removeClass('input_error');
                        }, 2000);
                    }
                }
            }

        },
        logIn: function (e) {
            var self = this;
            var jForm = $(e.target);
            var requared = true;
            var inputs = jForm.find('[data-required]');

            for(var i = 0; i < inputs.length; i++){
                if(inputs.eq(i).val() == '') {
                    requared = false;
                }
            }

            if(requared){
                loginData = 'id=' + self.login.name;
                $.ajax({
                    url:'login.php',
                    type:'POST',
                    data: loginData,
                    success: function(data){
                        if(data == 'error'){
                            UIkit.notification({
                                message: 'Такого пользователя нет!',
                                status: 'warning',
                                pos: 'bottom-right',
                            });
                        }
                        else{
                            UIkit.notification({
                                message: 'Добро пожаловать!',
                                status: 'success',
                                pos: 'bottom-right',
                            });
                            data = JSON.parse(data);
                            self.user.name = data.userName;
                            self.user.userId = data.userId;
                            self.sign.isLogin = true;
                        }
                    },
                    error: function (e) {

                    }
                });
            }
            else{
                for(var i = 0; i < inputs.length; i++){
                    if(inputs.eq(i).val() == '') {
                        inputs.eq(i).addClass('input_error');
                        setTimeout(function () {
                            inputs.removeClass('input_error');
                        }, 2000);
                    }
                }
            }
        },
    }
});
$(window).on('load', function () {
    setInterval(function () {
        getChatRoom(app.$data);
    }, 1500);
});

var requared = $('input[data-required]');
requared.blur(function() {var self = $(this);if($(this).val().length == "") {self.addClass('input_error');setTimeout(function () {self.removeClass('input_error')}, 2000)}});
requared.focus(function() {$(this).removeClass('input_error');});

