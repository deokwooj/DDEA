# DDEA
Data Driven Energy Analytics

## 1. Pre-requisites  

- Install following packages to Ubuntu. 
```sh
sudo apt-get install libncurses5-dev libfreetype6-dev libpng-dev graphviz libgraphviz-dev pkg-config libblas-dev libatlas-dev liblapack-dev gfortran r-base r-base-dev python-dev python-pip
```

- Open R repl and install bnlean and Rgraphviz.
```R
install.packages("bnlearn")

source("http://bioconductor.org/biocLite.R")
biocLite("Rgraphviz")
...
update all pacakge [a/y/n] a
```

- Install following Python packages  
<sup>*</sup>Should you need to make all packages available site-wise, it is then recommended to execute the commands with superuser permission.  
```sh
pip install --allow-all-external --upgrade decorator==3.4.0 six==1.8.0 gnureadline==6.3.3 graphviz==0.4 pygraphviz==1.1 python-dateutil==2.2 pytz==2014.7 rpy2==2.3.10 networkx==1.9
```

- Install following Numpy and Sklean packages. Each package takes some time to compile underlying C/C++ components that you should install numpy first then the rest of packages.
```sh
pip install --allow-all-external --upgrade numpy==1.9.1
pip install --allow-all-external --upgrade scipy==0.9.0 matplotlib==1.1.1 pandas==0.13.1 scikit-learn==0.14.1 scikits.statsmodels==0.3.1
```
