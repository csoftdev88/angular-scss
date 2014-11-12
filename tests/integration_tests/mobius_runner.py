import os

from salsa_webqa.salsa_runner import SalsaRunner


class MobiusRunner(SalsaRunner):
    """ Dedicated project runner, extends general SalsaRunner """
    def __init__(self):
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        SalsaRunner.__init__(self, self.project_root)

runner = MobiusRunner()
runner.run_tests()

# # Simpler case, possible if nothing needs to be overridden:
#
# project_root = os.path.dirname(os.path.abspath(__file__))

# runner = SalsaRunner(project_root)
# runner.run_tests()