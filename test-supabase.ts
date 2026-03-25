import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.storage.from("uploads").list()
  console.log("Root content:", data)
  if (error) console.error("Error:", error)
  
  const { data: folderData } = await supabase.storage.from("uploads").list("redecruzada@localhost/unsorted")
  console.log("Folder content:", folderData)
}

test()
