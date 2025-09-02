import psycopg2
import pandas as pd
from jinja2 import Environment, BaseLoader
from weasyprint import HTML
import datetime

def run_query(query: str, conn_params: dict, params: dict):
    env = Environment(loader=BaseLoader())
    sql_template = env.from_string(query)
    rendered_sql = sql_template.render(**params)

    conn = psycopg2.connect(**conn_params)
    df = pd.read_sql(rendered_sql, conn)
    conn.close()
    return df

def render_report(query: str, template: str, conn_params: dict, params: dict) -> bytes:
    df = run_query(query, conn_params, params)
    env = Environment(loader=BaseLoader())
    jinja_template = env.from_string(template)

    html_str = jinja_template.render(
        data=df.to_dict(orient="records"),
        generated_at=datetime.datetime.now().strftime("%d/%m/%Y %H:%M"),
        **params
    )
    return HTML(string=html_str).write_pdf()
