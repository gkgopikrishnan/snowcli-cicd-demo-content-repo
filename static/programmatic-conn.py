import snowflake.connector

# Connect to Snowflake
conn = snowflake.connector.connect(
    user='STRAINING',
    password='SuperGoodluck@025',
    account='LNVIESZ-AKB04277',
    warehouse='COMPUTE_WH',
    database='TEST',
    schema='TEST_SCH'
)

# Use a cursor to execute queries
cursor = conn.cursor()

# Load data using COPY INTO
cursor.execute("""
 select name, age from emp;
""")

cursor.execute("""
 insert into emp values ( 'Bharathi', 44);
""")

# Check the results
for row in cursor:
    print(row)

# Close connection
cursor.close()
conn.close()