# os-resources-ui
Contains UI features for OpenStack resources

# Installation

Retrieve os-resources-ui

Go to os-resources-ui and run:
  python setup.py sdist

Go to Horizon's root dir

cp ../os-resources-ui/os\_resources\_ui/enabled/\_1066*.py openstack\_dashboard/local/enabled

./tools/with\_venv.sh pip install -e ../os-resources-ui/
