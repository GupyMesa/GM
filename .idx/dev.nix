{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.gh
    pkgs.google-cloud-sdk
  ];
  idx = {
    extensions = [];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["node", "server.js"];
          manager = "web";
          env = { PORT = "$PORT"; };
        };
      };
    };
  };
}
