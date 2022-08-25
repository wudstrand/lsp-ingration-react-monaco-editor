FROM python:3

WORKDIR /python-lsp-server

# # TODO: Test Jedi version (current: 0.18.1, recommended: <0.16,>=0.14.1)
# RUN pip install -r requirements.txt
# RUN pip install 'python-lsp-server[all]'
# RUN pip install 'python-lsp-server[websockets]'

# EXPOSE 5000

# CMD pylsp --ws --port 5000 -v

# TODO: Test Jedi version (current: 0.18.1, recommended: <0.16,>=0.14.1)
# RUN pip install -r requirements.txt


RUN pip install pipenv
RUN pipenv install 'python-language-server[all]'

EXPOSE 5000

CMD pipenv run pyls --port 5000 -v