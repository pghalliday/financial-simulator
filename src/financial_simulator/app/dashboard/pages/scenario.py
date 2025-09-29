import dash
import dash_mantine_components as dmc

dash.register_page(
    __name__, path_template="scenarios/<scenario_id>", exclude_from_navbar=True
)


def layout(scenario_id=None, **kwargs):
    return dmc.Container(
        dmc.Text(f"Scenario ID: {scenario_id}"),
    )
