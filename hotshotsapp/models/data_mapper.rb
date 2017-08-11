require 'sinatra'
require 'json'
require 'data_mapper'
require_relative "api_wrapper"

set :bind, '127.0.0.1'
set :port, 27182

DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/models/database.db")

DataMapper.finalize()
DataMapper.auto_upgrade!()

class DatabaseInsert
  @@apiWrapper = APIWrapper.new

end
