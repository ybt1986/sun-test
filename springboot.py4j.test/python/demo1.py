import random
import string
import time
import threading
from py4j.java_gateway import JavaGateway, GatewayParameters, CallbackServerParameters

gateway = JavaGateway(gateway_parameters=GatewayParameters(address='127.0.0.1', port=18080),
                      callback_server_parameters=CallbackServerParameters(address='127.0.0.1', port=18081))
app = gateway.entry_point
jvm = gateway.jvm
# random = gateway.jvm.java.util.Random()
# number1 = random.nextInt(10)
# number2 = random.nextInt(10)
# print(number1, number2)

class MyTestService(object):
    def __init__(self):
        pass

    def test(self):
        time.sleep(0.5)
        return ''.join(random.sample(string.ascii_letters + string.digits, 8))

    class Java:
        implements = ["com.sample.suncht.service.TestService"]


beanManageService = app.getBean('beanManageService')
if beanManageService.unregisterObject('mytestservice'):
    beanManageService.registerObject('mytestservice', MyTestService())

print(app.getBean('mytestservice').test())


class MyArithmeticService(object):
    def __init__(self):
        self._progress = 0
        self._result = ''
        self._status = 0

    def process(self):
        t = threading.Thread(target=self.process_back, args=())
        t.start()

    def process_back(self):
        self._status = 1
        time.sleep(1.1)
        self._progress = 20

        time.sleep(1.1)
        self._progress = 50

        time.sleep(2.1)
        self._progress = 80

        time.sleep(3.1)
        self._progress = 100
        self._status = 10
        self._result = ''.join(random.sample(string.ascii_letters + string.digits, 8))

    def progress(self):
        return jvm.java.lang.Integer(self._progress)

    def result(self):
        return self._result

    def status(self):
        return jvm.java.lang.Integer(self._status)

    def reset(self):
        self._progress = 0
        self._result = ''
        self._status = 0

    class Java:
        implements = ["com.sample.suncht.service.ArithmeticService"]


if beanManageService.unregisterObject('myArithmeticService'):
    beanManageService.registerObject('myArithmeticService', MyArithmeticService())
