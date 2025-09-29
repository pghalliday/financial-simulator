import dash
import dash_mantine_components as dmc

dash.register_page(
    __name__, path_template="entities/<entity_id>", exclude_from_navbar=True
)


def layout(entity_id=None, **kwargs):
    return dmc.Container(
        dmc.Text(f"Entity ID: {entity_id}"),
    )
