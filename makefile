DOC_DIR := src/doc
$(info DOC_DIR: $(DOC_DIR))
$(info )

EXISTING_NOTEBOOK_FILES := $(shell find $(DOC_DIR) -name "*.ipynb")
$(info EXISTING_NOTEBOOK_FILES: $(EXISTING_NOTEBOOK_FILES))
$(info )

EXISTING_PYTHON_FILES := $(shell find $(DOC_DIR) -name "*.notebook.py")
$(info EXISTING_PYTHON_FILES: $(EXISTING_PYTHON_FILES))
$(info )

EXPECTED_PYTHON_FILES := $(EXISTING_NOTEBOOK_FILES:.ipynb=.notebook.py)
$(info EXPECTED_PYTHON_FILES: $(EXPECTED_PYTHON_FILES))
$(info )

EXPECTED_MARKDOWN_FILES := $(patsubst $(DOC_DIR)/%.ipynb,%.md,$(EXISTING_NOTEBOOK_FILES))
$(info EXPECTED_MARKDOWN_FILES: $(EXPECTED_MARKDOWN_FILES))
$(info )

EXPECTED_NOTEBOOK_FILES := $(EXISTING_PYTHON_FILES:.notebook.py=.ipynb)
$(info EXPECTED_NOTEBOOK_FILES: $(EXPECTED_NOTEBOOK_FILES))
$(info )

.PHONY: \
	prepare_commit \
	update_py_files \
	update_md_files \
	init_project \
	create_notebook_files \
	clean \
	clean_notebook_files \
	clean_markdown_files

.PRECIOUS: \
	%.papermill

prepare_commit: update_py_files update_md_files

update_py_files: $(EXPECTED_PYTHON_FILES)

update_md_files: $(EXPECTED_MARKDOWN_FILES)

init_project: create_notebook_files

create_notebook_files: $(EXPECTED_NOTEBOOK_FILES)

%.notebook.py: %.ipynb
	uv run jupytext --output $@ $<

define markdown_rule
$1: $(DOC_DIR)/$(1:.md=.ipynb)
	uv run jupyter nbconvert --execute --to markdown --stdout $$< | \
	sed -re 's|<!-- INSERT_IMAGE:([^:]+):([^ ]+) -->|![\1]($(DOC_DIR)/$(1:.md=.assets)/\2)|g' > $$@
endef
$(foreach md,$(EXPECTED_MARKDOWN_FILES),$(eval $(call markdown_rule, $(md))))

%.ipynb: %.notebook.py
	uv run jupytext --output $@ $<

clean: clean_notebook_files

clean_notebook_files:
	find $(DOC_DIR) -name "*.ipynb" -type f -delete

clean_markdown_files:
	rm $(EXPECTED_MARKDOWN_FILES)
