from setuptools import setup, find_packages

setup(
    name="pyModel",
    version="0.1",

    author="Yawen",
    author_email="yawend@kth.se",
    description="NLP package for online survey",
    url="https://github.com/wdhub/jsPsych/",

    packages=find_packages(),

    # # excel data
    # data_file='driver_model_data.xlsx',
    # include_package_data=True,
    # package_data={
    #     '': ['*.xlsx'], }

    install_requires=[
        'numpy>=1.18.5',
        'scikit-learn>=0.23.2',
        'gensim>=3.4.0',
    ],
)